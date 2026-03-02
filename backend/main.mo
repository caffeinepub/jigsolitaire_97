import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();
  // Types
  type UserProfile = {
    name : Text;
  };

  type ThemeId = Text;

  type PuzzleResult = {
    stars : Nat;
    bestTime : Nat;
  };

  type ThemeData = {
    puzzleResults : [PuzzleResult];
  };

  type UserImage = {
    id : Nat;
    name : Text;
    blob : Storage.ExternalBlob;
    createdAt : Int;
  };

  type UserProgress = {
    coins : Nat;
    hints : Nat;
    lastHintRegenTime : Int;
    themeProgress : [(ThemeId, ThemeData)];
    achievements : [Text];
    lastDailyDay : Nat;
  };

  // State
  var userProfiles : Map.Map<Principal, UserProfile> = Map.empty();
  var gameProgress : Map.Map<Principal, UserProgress> = Map.empty();
  var userImages : Map.Map<Principal, Map.Map<Nat, UserImage>> = Map.empty();
  var userNextImageId : Map.Map<Principal, Nat> = Map.empty();

  // Constants
  let TWO_HOURS : Nat = 7_200_000_000_000;
  let MAX_HINTS : Nat = 5;
  let HINT_COST : Nat = 100;
  let NANOS_PER_DAY : Nat = 86_400_000_000_000;
  let TIME_BONUS_3X3 : Nat = 60;
  let TIME_BONUS_4X4 : Nat = 120;
  let TIME_BONUS_5X5 : Nat = 180;

  // Helpers
  func requireAuth(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Not authenticated");
    };
  };

  func getMap<V>(store : Map.Map<Principal, Map.Map<Nat, V>>, user : Principal) : Map.Map<Nat, V> {
    switch (store.get(user)) {
      case (?m) { m };
      case (null) {
        let m = Map.empty<Nat, V>();
        store.add(user, m);
        m;
      };
    };
  };

  func defaultProgress() : UserProgress {
    {
      coins = 0;
      hints = 3;
      lastHintRegenTime = Time.now();
      themeProgress = [];
      achievements = [];
      lastDailyDay = 0;
    };
  };

  func getOrCreateProgress(caller : Principal) : UserProgress {
    switch (gameProgress.get(caller)) {
      case (?p) { p };
      case (null) {
        let p = defaultProgress();
        gameProgress.add(caller, p);
        p;
      };
    };
  };

  // Materialize time-based hint regeneration
  func materializeHints(progress : UserProgress) : (Nat, Int) {
    let now = Time.now();
    let elapsed : Int = now - progress.lastHintRegenTime;
    let regenCount : Nat = if (elapsed > 0) { Int.abs(elapsed) / TWO_HOURS } else {
      0;
    };
    let currentHints = Nat.min(progress.hints + regenCount, MAX_HINTS);
    let regenNs : Int = regenCount * TWO_HOURS;
    let newRegenTime : Int = if (currentHints >= MAX_HINTS) {
      now;
    } else if (regenCount > 0) {
      progress.lastHintRegenTime + regenNs;
    } else {
      progress.lastHintRegenTime;
    };
    (currentHints, newRegenTime);
  };

  func hasAchievement(achievements : [Text], id : Text) : Bool {
    for (a in achievements.vals()) {
      if (a == id) { return true };
    };
    false;
  };

  func getThemeUnlockCost(themeId : ThemeId) : Nat {
    switch (themeId) {
      // Tier 1: Free & cheap
      case ("nature") { 0 };
      case ("animals") { 3 };

      case ("forests") { 12 };
      case ("sunsets") { 16 };
      // Tier 2: Early
      case ("landmarks") { 20 };
      case ("coffee") { 24 };
      case ("lakes") { 28 };
      case ("pets") { 32 };
      case ("vintage") { 35 };
      case ("spring") { 39 };
      case ("coastal") { 43 };
      case ("minimalist") { 47 };
      // Tier 3: Mid
      case ("meadows") { 52 };
      case ("birds") { 57 };
      case ("cityscapes") { 62 };
      case ("ocean") { 67 };
      case ("fruits") { 72 };
      case ("villages") { 77 };
      case ("summer") { 82 };
      case ("music") { 87 };
      case ("tropical") { 92 };
      case ("abstract") { 97 };
      // Tier 4: Mid-late
      case ("bridges") { 103 };
      case ("patterns") { 109 };
      case ("wildlife") { 115 };
      case ("mountains") { 121 };
      case ("roads") { 127 };
      case ("autumn_colors") { 133 };
      case ("fashion") { 139 };
      case ("architecture") { 145 };
      case ("macro") { 151 };
      case ("canyons") { 157 };
      case ("objects") { 163 };
      // Tier 5: Late
      case ("camping") { 170 };
      case ("dining") { 177 };
      case ("marine") { 184 };
      case ("historic") { 191 };
      case ("winter_snow") { 198 };
      case ("rivers") { 205 };
      case ("workspace") { 212 };
      case ("textures") { 219 };
      case ("colorful") { 226 };
      case ("harbors") { 233 };
      case ("misty") { 240 };
      // Tier 6: Endgame
      case ("interiors") { 248 };
      case ("night_sky") { 256 };
      case ("railways") { 264 };
      case ("dark_moody") { 272 };
      case ("towers") { 280 };
      case ("books") { 288 };
      case (_) { 0 };
    };
  };

  func computeTotalStars(themeProgress : [(ThemeId, ThemeData)]) : Nat {
    var total = 0;
    for ((_, data) in themeProgress.vals()) {
      for (r in data.puzzleResults.vals()) {
        total += r.stars;
      };
    };
    total;
  };

  func getUserImages(user : Principal) : Map.Map<Nat, UserImage> {
    switch (userImages.get(user)) {
      case (?m) { m };
      case (null) {
        let m = Map.empty<Nat, UserImage>();
        userImages.add(user, m);
        m;
      };
    };
  };

  func genImageId(user : Principal) : Nat {
    let id = switch (userNextImageId.get(user)) {
      case (?id) { id };
      case (null) { 1 };
    };
    userNextImageId.add(user, id + 1);
    id;
  };

  let MAX_USER_IMAGES : Nat = 50;

  func findThemeData(themeProgress : [(ThemeId, ThemeData)], themeId : ThemeId) : ?ThemeData {
    for ((id, data) in themeProgress.vals()) {
      if (id == themeId) {
        return ?data;
      };
    };
    null;
  };

  func requirePuzzleAccess(progress : UserProgress, themeId : ThemeId, puzzleIndex : Nat) {
    let unlockCost = getThemeUnlockCost(themeId);
    if (unlockCost > 0) {
      let totalStars = computeTotalStars(progress.themeProgress);
      if (totalStars < unlockCost) {
        Runtime.trap("Theme not unlocked");
      };
    };
    if (puzzleIndex > 0) {
      switch (findThemeData(progress.themeProgress, themeId)) {
        case (null) { Runtime.trap("Puzzle not unlocked") };
        case (?data) {
          if (data.puzzleResults.size() < puzzleIndex) {
            Runtime.trap("Puzzle not unlocked");
          };
        };
      };
    };
  };

  // Profile endpoints
  public query ({ caller }) func getProfile() : async ?UserProfile {
    requireAuth(caller);
    userProfiles.get(caller);
  };

  public shared ({ caller }) func setProfile(name : Text) : async () {
    requireAuth(caller);
    if (name == "") {
      Runtime.trap("Name cannot be empty");
    };
    if (name.size() > 100) {
      Runtime.trap("Name must be 100 characters or fewer");
    };
    userProfiles.add(caller, { name });
  };

  // Game endpoints
  public query ({ caller }) func getProgress() : async UserProgress {
    requireAuth(caller);
    switch (gameProgress.get(caller)) {
      case (?p) {
        let (currentHints, _) = materializeHints(p);
        { p with hints = currentHints };
      };
      case (null) { defaultProgress() };
    };
  };

  public shared ({ caller }) func startPuzzle(themeId : ThemeId, puzzleIndex : Nat, gridSize : Nat) : async () {
    requireAuth(caller);
    if (themeId == "") { Runtime.trap("Invalid theme") };
    if (puzzleIndex >= 5) { Runtime.trap("Invalid puzzle index") };
    if (gridSize != 3 and gridSize != 4 and gridSize != 5) {
      Runtime.trap("Invalid grid size");
    };

    let progress = getOrCreateProgress(caller);
    requirePuzzleAccess(progress, themeId, puzzleIndex);
  };

  // Returns (coinsEarned, stars, isFirstTime, newlyAwardedAchievements)
  public shared ({ caller }) func completePuzzle(themeId : ThemeId, puzzleIndex : Nat, hintsUsed : Nat, timeSec : Nat, gridSize : Nat, moves : Nat, timedCompletion : Bool) : async (Nat, Nat, Bool, [Text]) {
    requireAuth(caller);
    if (puzzleIndex >= 5) { Runtime.trap("Invalid puzzle index") };

    let progress = getOrCreateProgress(caller);
    requirePuzzleAccess(progress, themeId, puzzleIndex);
    let previousData = findThemeData(progress.themeProgress, themeId);

    // Stars based on move count: 3 (≤ optimal), 2 (≤ 2× optimal), 1 (> 2× optimal)
    let optimal = gridSize * gridSize;
    let stars = if (moves <= optimal) { 3 } else if (moves <= optimal * 2) { 2 } else {
      1;
    };

    // Coins: 10 base + 10 no-hints bonus + 10 time bonus (only when timed mode)
    var coinsEarned = 10;
    if (hintsUsed == 0) { coinsEarned += 10 };
    if (timedCompletion) {
      let timeThreshold = if (gridSize == 3) { TIME_BONUS_3X3 } else if (gridSize == 4) {
        TIME_BONUS_4X4;
      } else { TIME_BONUS_5X5 };
      if (timeSec <= timeThreshold) { coinsEarned += 10 };
    };

    // First-time detection: first time if puzzleIndex >= puzzleResults.size()
    let isFirstTime = switch (previousData) {
      case (null) { true };
      case (?data) { puzzleIndex >= data.puzzleResults.size() };
    };

    // Theme completion bonus (all 5 puzzles, first time completing the 5th)
    if (puzzleIndex == 4 and isFirstTime) {
      coinsEarned += 50;
    };

    // Build best time for this puzzle
    let bestTime = if (timedCompletion) {
      switch (previousData) {
        case (null) { timeSec };
        case (?data) {
          if (puzzleIndex < data.puzzleResults.size()) {
            let prev = data.puzzleResults[puzzleIndex].bestTime;
            if (prev == 0 or timeSec < prev) { timeSec } else { prev };
          } else {
            timeSec;
          };
        };
      };
    } else {
      // Not timed: preserve existing bestTime if replaying
      switch (previousData) {
        case (null) { 0 };
        case (?data) {
          if (puzzleIndex < data.puzzleResults.size()) {
            data.puzzleResults[puzzleIndex].bestTime;
          } else {
            0;
          };
        };
      };
    };

    // Build updated puzzleResults
    let newPuzzleResults = switch (previousData) {
      case (null) { [{ stars; bestTime }] };
      case (?data) {
        if (isFirstTime) {
          data.puzzleResults.concat([{ stars; bestTime }]);
        } else {
          // Replay: update stars if better, bestTime already computed
          Array.tabulate(
            data.puzzleResults.size(),
            func(i) {
              if (i == puzzleIndex) {
                {
                  stars = Nat.max(data.puzzleResults[i].stars, stars);
                  bestTime;
                };
              } else {
                data.puzzleResults[i];
              };
            },
          );
        };
      };
    };

    let newThemeData : ThemeData = {
      puzzleResults = newPuzzleResults;
    };

    // Update or insert theme in progress array
    var themeFound = false;
    let updatedThemeProgress = Array.tabulate(
      progress.themeProgress.size(),
      func(i) {
        let (id, data) = progress.themeProgress[i];
        if (id == themeId) {
          themeFound := true;
          (id, newThemeData);
        } else {
          (id, data);
        };
      },
    );
    let finalThemeProgress = if (not themeFound) {
      updatedThemeProgress.concat([(themeId, newThemeData)]);
    } else {
      updatedThemeProgress;
    };

    // Check achievements
    var newAchievements = progress.achievements;

    // "first_steps" — solve any puzzle for the first time
    if (isFirstTime and not hasAchievement(newAchievements, "first_steps")) {
      newAchievements := newAchievements.concat(["first_steps"]);
    };

    // "theme_master" — complete all 5 puzzles in a theme
    if (newPuzzleResults.size() >= 5 and not hasAchievement(newAchievements, "theme_master")) {
      newAchievements := newAchievements.concat(["theme_master"]);
    };

    // "speed_demon" — complete a puzzle in under 60 seconds
    if (timeSec < 60 and not hasAchievement(newAchievements, "speed_demon")) {
      newAchievements := newAchievements.concat(["speed_demon"]);
    };

    // "perfectionist" — all 5 puzzles in a theme with 3 stars
    if (newPuzzleResults.size() >= 5 and not hasAchievement(newAchievements, "perfectionist")) {
      var allThreeStars = true;
      for (r in newPuzzleResults.vals()) {
        if (r.stars < 3) { allThreeStars := false };
      };
      if (allThreeStars) {
        newAchievements := newAchievements.concat(["perfectionist"]);
      };
    };

    // "collector" — 10 total completed puzzles across all themes
    if (not hasAchievement(newAchievements, "collector")) {
      var totalCompleted = 0;
      for ((_, data) in finalThemeProgress.vals()) {
        totalCompleted += data.puzzleResults.size();
      };
      if (totalCompleted >= 10) {
        newAchievements := newAchievements.concat(["collector"]);
      };
    };

    // "hint_free" — complete a hard puzzle (5x5) with 0 hints
    if (gridSize == 5 and hintsUsed == 0 and not hasAchievement(newAchievements, "hint_free")) {
      newAchievements := newAchievements.concat(["hint_free"]);
    };

    // "explorer" — solve puzzles in 10 different themes
    if (not hasAchievement(newAchievements, "explorer")) {
      if (finalThemeProgress.size() >= 10) {
        newAchievements := newAchievements.concat(["explorer"]);
      };
    };

    // "globetrotter" — complete all 5 puzzles in 25 themes
    if (not hasAchievement(newAchievements, "globetrotter")) {
      var completedThemes = 0;
      for ((_, data) in finalThemeProgress.vals()) {
        if (data.puzzleResults.size() >= 5) { completedThemes += 1 };
      };
      if (completedThemes >= 25) {
        newAchievements := newAchievements.concat(["globetrotter"]);
      };
    };

    // "completionist" — complete every puzzle in every theme (50 themes)
    if (not hasAchievement(newAchievements, "completionist")) {
      var allComplete = finalThemeProgress.size() >= 50;
      if (allComplete) {
        for ((_, data) in finalThemeProgress.vals()) {
          if (data.puzzleResults.size() < 5) { allComplete := false };
        };
      };
      if (allComplete) {
        newAchievements := newAchievements.concat(["completionist"]);
      };
    };

    // Compute newly awarded achievements (diff)
    let previousAchievements = progress.achievements;
    let awardedAchievements = newAchievements.filter(
      func(a) { not hasAchievement(previousAchievements, a) }
    );

    gameProgress.add(
      caller,
      {
        coins = progress.coins + coinsEarned;
        hints = progress.hints;
        lastHintRegenTime = progress.lastHintRegenTime;
        themeProgress = finalThemeProgress;
        achievements = newAchievements;
        lastDailyDay = progress.lastDailyDay;
      },
    );

    (coinsEarned, stars, isFirstTime, awardedAchievements);
  };

  public shared ({ caller }) func useHint() : async () {
    requireAuth(caller);
    let progress = getOrCreateProgress(caller);
    let (currentHints, newRegenTime) = materializeHints(progress);
    if (currentHints == 0) { Runtime.trap("No hints available") };
    gameProgress.add(
      caller,
      {
        coins = progress.coins;
        hints = currentHints - 1;
        lastHintRegenTime = newRegenTime;
        themeProgress = progress.themeProgress;
        achievements = progress.achievements;
        lastDailyDay = progress.lastDailyDay;
      },
    );
  };

  public shared ({ caller }) func buyHint() : async () {
    requireAuth(caller);
    let progress = getOrCreateProgress(caller);
    if (progress.coins < HINT_COST) { Runtime.trap("Not enough coins") };
    let (currentHints, newRegenTime) = materializeHints(progress);
    if (currentHints >= MAX_HINTS) { Runtime.trap("Already at max hints") };
    gameProgress.add(
      caller,
      {
        coins = progress.coins - HINT_COST;
        hints = currentHints + 1;
        lastHintRegenTime = newRegenTime;
        themeProgress = progress.themeProgress;
        achievements = progress.achievements;
        lastDailyDay = progress.lastDailyDay;
      },
    );
  };

  // Returns (coinsEarned, stars)
  public shared ({ caller }) func completeDailyPuzzle(hintsUsed : Nat, timeSec : Nat, gridSize : Nat, moves : Nat) : async (Nat, Nat) {
    requireAuth(caller);
    if (gridSize != 3 and gridSize != 4 and gridSize != 5) {
      Runtime.trap("Invalid grid size");
    };

    let progress = getOrCreateProgress(caller);

    let today = Int.abs(Time.now()) / NANOS_PER_DAY;
    if (progress.lastDailyDay == today) {
      Runtime.trap("Daily puzzle already completed today");
    };

    // Stars based on move count
    let optimal = gridSize * gridSize;
    let stars = if (moves <= optimal) { 3 } else if (moves <= optimal * 2) { 2 } else {
      1;
    };

    // Coins: 10 base + 10 no-hints bonus
    var coinsEarned = 10;
    if (hintsUsed == 0) { coinsEarned += 10 };

    gameProgress.add(
      caller,
      {
        coins = progress.coins + coinsEarned;
        hints = progress.hints;
        lastHintRegenTime = progress.lastHintRegenTime;
        themeProgress = progress.themeProgress;
        achievements = progress.achievements;
        lastDailyDay = today;
      },
    );

    (coinsEarned, stars);
  };

  // Custom image endpoints
  public shared ({ caller }) func uploadImage(name : Text, blob : Storage.ExternalBlob) : async UserImage {
    requireAuth(caller);
    if (name == "") { Runtime.trap("Name cannot be empty") };
    if (name.size() > 50) {
      Runtime.trap("Name must be 50 characters or fewer");
    };

    let images = getUserImages(caller);
    if (images.size() >= MAX_USER_IMAGES) {
      Runtime.trap("Maximum of 50 images allowed");
    };

    let imageId = genImageId(caller);
    let image : UserImage = {
      id = imageId;
      name;
      blob;
      createdAt = Time.now();
    };
    images.add(imageId, image);
    image;
  };

  public query ({ caller }) func getMyImages() : async [UserImage] {
    requireAuth(caller);
    getUserImages(caller).values().toArray();
  };

  public shared ({ caller }) func renameImage(imageId : Nat, newName : Text) : async () {
    requireAuth(caller);
    if (newName == "") {
      Runtime.trap("Name cannot be empty");
    };
    if (newName.size() > 50) {
      Runtime.trap("Name must be 50 characters or fewer");
    };
    let images = getUserImages(caller);
    switch (images.get(imageId)) {
      case (null) { Runtime.trap("Image not found") };
      case (?image) {
        images.add(imageId, { image with name = newName });
      };
    };
  };

  public shared ({ caller }) func deleteImage(imageId : Nat) : async () {
    requireAuth(caller);
    let images = getUserImages(caller);
    if (not images.containsKey(imageId)) {
      Runtime.trap("Image not found");
    };
    images.remove(imageId);
  };
};
