export type ThemeId =
  | "abstract"
  | "animals"
  | "architecture"
  | "autumn_colors"
  | "birds"
  | "books"
  | "bridges"
  | "camping"
  | "canyons"
  | "cityscapes"
  | "coastal"
  | "coffee"
  | "colorful"
  | "dark_moody"
  | "dining"
  | "fashion"
  | "forests"
  | "fruits"
  | "harbors"
  | "historic"
  | "interiors"
  | "lakes"
  | "landmarks"
  | "macro"
  | "marine"
  | "meadows"
  | "minimalist"
  | "misty"
  | "mountains"
  | "music"
  | "nature"
  | "night_sky"
  | "objects"
  | "ocean"
  | "patterns"
  | "pets"
  | "railways"
  | "rivers"
  | "roads"
  | "spring"
  | "summer"
  | "sunsets"
  | "textures"
  | "towers"
  | "tropical"
  | "villages"
  | "vintage"
  | "wildlife"
  | "winter_snow"
  | "workspace";

export interface PuzzleImage {
  imageId: number;
  name: string;
}

export const PUZZLE_IMAGES: Record<ThemeId, PuzzleImage[]> = {
  landmarks: [
    { imageId: 43, name: "Grayscale Photo Of Lighted Brooklyn Bridge" },
    { imageId: 392, name: "Golden Gate Bridge, London" },
    { imageId: 613, name: "Golden Gate Bridge From Shore, Red" },
    { imageId: 742, name: "Statue Of Liberty Close-Up, Iconic" },
    { imageId: 818, name: "Statue Of Liberty From Below, Dramatic Angle" },
  ],
  coffee: [
    { imageId: 63, name: "White Coffee Cup On Red Background, Top View" },
    { imageId: 366, name: "Coffee Cup On Desk With Keyboard" },
    { imageId: 425, name: "Coffee Beans On Wooden Surface" },
    { imageId: 635, name: "Coffee Cups On Wooden Table, Cozy Cafe" },
    { imageId: 882, name: "Coffee Cup And Notebook On Desk, Overhead" },
  ],
  pets: [
    {
      imageId: 169,
      name: "Two Short-Coated Tan Puppies On Grass Field Dur...",
    },
    { imageId: 237, name: "Close-Up Of Black Dog Face" },
    { imageId: 659, name: "Husky Dog With Harness, Portrait" },
    { imageId: 837, name: "Bulldog Close-Up, Tongue Out" },
    { imageId: 1062, name: "Pug Wrapped In Blanket On Bed" },
  ],
  music: [
    { imageId: 26, name: "Black Corded Headphones Near Eyeglasses" },
    {
      imageId: 117,
      name: "Silhouette Photography Of Group Of People On Co...",
    },
    { imageId: 453, name: "Concert Crowd With Raised Hands, Stage Lights" },
    { imageId: 1066, name: "Baby Listening To Guitar, Intimate Moment" },
    { imageId: 1082, name: "Hands Playing Piano Keys, Black And White" },
  ],
  railways: [
    { imageId: 204, name: "Train Railway Under White And Blue Sky" },
    { imageId: 242, name: "Railroad Tracks In City At Night, Lit Up" },
    { imageId: 408, name: "Railroad Tracks At Sunset, Urban View" },
    { imageId: 478, name: "Railroad Tracks Through Green Tree Corridor" },
    { imageId: 692, name: "Grand Central Station Interior, Bustling" },
  ],
  workspace: [
    { imageId: 0, name: "Macbook Air Near Mug On Table" },
    { imageId: 5, name: "Man Using Macbook Air" },
    { imageId: 48, name: "Silver Macbook" },
    { imageId: 370, name: "Closeup Photo Of Turned-On Macbook Air" },
    { imageId: 532, name: "Desk Workspace With Laptop, Overhead View" },
  ],
  books: [
    { imageId: 4, name: "Man Sitting While Writing On Notebook" },
    { imageId: 24, name: "Opened Book" },
    { imageId: 367, name: "Person Holding Black Amazon Kindle E-Book Reader" },
    { imageId: 832, name: "Woman Reading By Warm Light, Interior" },
    { imageId: 1073, name: "Open Books Collage, Pages Visible" },
  ],
  night_sky: [
    { imageId: 120, name: "Starry Night Sky Over Fence, Milky Way" },
    { imageId: 537, name: "Starry Night Sky With Shooting Star" },
    { imageId: 723, name: "Night Sky With Stars, Moody Clouds" },
    { imageId: 903, name: "Milky Way Galaxy And Stars, Vivid Night Sky" },
    { imageId: 981, name: "Star Trails Circle Over Rocky Landscape, Night" },
  ],
  vintage: [
    { imageId: 99, name: "Old Wagon Wheel Close-Up, Black And White" },
    { imageId: 319, name: "Person Holding Vintage Film Camera" },
    { imageId: 452, name: "Retro Motel Neon Sign, Vintage" },
    { imageId: 531, name: "Vintage Camera On Dark Surface, Close-Up" },
    { imageId: 892, name: "Rusty Plymouth Car, Dark Moody" },
  ],
  patterns: [
    { imageId: 618, name: "Geometric Geodesic Dome Structure Close-Up" },
    { imageId: 940, name: "Green Succulent Plants Repeating Pattern" },
    { imageId: 948, name: "Modern Geometric Building Looking Up, Angular" },
    { imageId: 958, name: "Green Succulent Plants Close-Up, Texture" },
    { imageId: 1031, name: "Modern Glass Building Looking Up, Geometric" },
  ],
  marine: [
    { imageId: 581, name: "Blue Jellyfish Or Balloons Against Sky" },
    { imageId: 881, name: "Jellyfish Underwater, Blue Light" },
    { imageId: 848, name: "Deep Dark Blue Underwater Ocean Scene" },
    { imageId: 1083, name: "Aerial Couple On Boat, Turquoise Water" },
    { imageId: 1069, name: "Orange Jellyfish Underwater, Deep Blue" },
  ],
  fruits: [
    { imageId: 35, name: "Cactus Spines Macro In Golden Sunlight" },
    { imageId: 75, name: "Grapes On Vine, Close-Up" },
    { imageId: 429, name: "Raspberries On White Ceramic Mug With Saucer" },
    { imageId: 517, name: "Orange Citrus Fruit On Green Branch" },
    { imageId: 789, name: "Cactus Plants Close-Up, Green Spines" },
  ],
  dining: [
    { imageId: 42, name: "Two Gray Ceramic Mugs On Brown Wooden Dining Table" },
    { imageId: 163, name: "Dining Table With Menu Board And Flower On Top" },
    { imageId: 999, name: "Dark Food Styling Overhead" },
    { imageId: 312, name: "Honey Pot With Dipper, Warm Tones" },
    {
      imageId: 488,
      name: "Colorful Vegetable Bowl On Cutting Board, Overhead",
    },
  ],
  objects: [
    { imageId: 23, name: "Silver Forks Close-Up, Dark Abstract" },
    { imageId: 32, name: "Brown Steel Bench Beside Wall" },
    { imageId: 90, name: "Green Glass Jars On Brown Wooden Fence" },
    {
      imageId: 113,
      name: "Close-Up Photography Of Gray Metal Container Wi...",
    },
    { imageId: 252, name: "Flat Lay Icons And Tools Illustration" },
  ],
  camping: [
    { imageId: 76, name: "Old Wooden Cabin With Teal Door And Bicycle" },
    { imageId: 342, name: "Woman Wearing Backpack Walking On Road" },
    { imageId: 483, name: "Green Mountain Ridge Hiking Trail" },
    { imageId: 633, name: "Person Hiking In Mountain Landscape, Sunset" },
    { imageId: 726, name: "Person Hiking In Snowy Winter Mountains" },
  ],
  colorful: [
    { imageId: 56, name: "Colorful Bokeh Light Circles, Abstract" },
    { imageId: 397, name: "Colorful Italian Coastal Village Houses" },
    { imageId: 514, name: "European Colorful Buildings And White Truck" },
    { imageId: 703, name: "Rainbow Over City Skyline" },
    { imageId: 799, name: "Bridge With Purple Lights At Night, Reflection" },
  ],
  bridges: [
    { imageId: 47, name: "Bridge Over Body Of Water On Grayscale Phot" },
    { imageId: 134, name: "Brown And Grey Concrete Bridge" },
    { imageId: 520, name: "Manhattan Bridge Through Brick Buildings, Street" },
    { imageId: 663, name: "Suspension Bridge Through Fog And Clouds" },
    { imageId: 879, name: "Person On Bridge In Fog, Atmospheric Moody" },
  ],
  villages: [
    { imageId: 49, name: "Concrete Buildings At Santorini, Greece During ..." },
    { imageId: 195, name: "String Lights In Narrow Alley At Night" },
    { imageId: 409, name: "Ornate European Building Facade, Classic" },
    { imageId: 188, name: "European Snowy Town Rooftops, Panoramic" },
    { imageId: 838, name: "Parent With Child On Cobblestone Street" },
  ],
  historic: [
    { imageId: 61, name: "Mosque Under Clouds Grayscale Photography" },
    { imageId: 142, name: "Grand Castle At End Of Long Road" },
    { imageId: 343, name: "Old Stone Arch Doorway/Entrance" },
    { imageId: 546, name: "Illuminated Arched Colonnade, Warm Stone" },
    { imageId: 782, name: "Old Church Interior, Stone Arches" },
  ],
  towers: [
    { imageId: 58, name: "Lighthouse, Black And White" },
    { imageId: 372, name: "Lifeguard Tower On Sandy Beach" },
    { imageId: 641, name: "Lifeguard Tower On Beach, Minimalist" },
    { imageId: 972, name: "Skyscrapers Looking Up Into Fog, Dramatic" },
    { imageId: 1075, name: "CN Tower Between Glass Buildings, Urban" },
  ],
  winter_snow: [
    { imageId: 29, name: "Snow Mountain With Few White Clouds" },
    { imageId: 423, name: "Snow-Covered Pine Trees, Winter Forest" },
    { imageId: 558, name: "Snowy Winter Trees And Pathway" },
    { imageId: 559, name: "Winter Snowy Road Through Bare Trees" },
    { imageId: 678, name: "Snowy Mountain Range, Dark Dramatic Peaks" },
  ],
  autumn_colors: [
    { imageId: 553, name: "Park Bench Among Autumn Orange Leaves" },
    { imageId: 568, name: "Autumn Trees Reflected In Calm Lake" },
    { imageId: 648, name: "Golden Dry Grass Field, Warm Autumn" },
    { imageId: 776, name: "Autumn Leaves Close-Up With Golden Bokeh" },
    { imageId: 923, name: "Autumn Forest Path With Orange Red Leaves" },
  ],
  spring: [
    { imageId: 33, name: "Wildflowers In Meadow At Golden Hour" },
    { imageId: 106, name: "Close-Up Photo Of Pink Petaled Flower" },
    { imageId: 360, name: "Closeup Photo Of Red Petaled Flower In Bloom" },
    { imageId: 696, name: "Red And Orange Tulips, Close-Up" },
    { imageId: 798, name: "Daisy Flower Close-Up, White Petals" },
  ],
  tropical: [
    { imageId: 77, name: "Wooden Pier Extending Over Turquoise Ocean" },
    { imageId: 128, name: "Aerial View Of Turquoise Bay And Coastline" },
    { imageId: 772, name: "Lush Green Tropical Mountain Forest" },
    { imageId: 773, name: "Aerial Turquoise Coastline With Green Mountains" },
    { imageId: 645, name: "Palm Trees Against Tropical Sky" },
  ],
  wildlife: [
    { imageId: 139, name: "Snails On Wooden Surface Close-Up" },
    { imageId: 219, name: "Leopard On Dirt Road" },
    { imageId: 582, name: "Wolf Or Coyote Face Close-Up Portrait" },
    { imageId: 718, name: "Wolf Standing In Golden Grass Field" },
    { imageId: 1020, name: "Brown Bear On Rocky Terrain, Wildlife" },
  ],
  animals: [
    { imageId: 584, name: "Horses In Green Field" },
    { imageId: 200, name: "Highland Cow, Shaggy Brown" },
    { imageId: 611, name: "Flock Of Seagulls On Sandy Beach" },
    { imageId: 790, name: "Deer Standing In Misty Field At Dawn" },
    { imageId: 943, name: "Deer Silhouettes At Golden Hour" },
  ],
  birds: [
    { imageId: 50, name: "Black Bird Perching On Rope During Daytime" },
    { imageId: 130, name: "Grayscale Photo Of Bird Flying" },
    { imageId: 258, name: "Sand Dune With Birds Flying Overhead" },
    { imageId: 689, name: "Seabird Flying Over Calm Water" },
    { imageId: 705, name: "Dramatic Sunset Clouds With Bird Silhouette" },
  ],
  canyons: [
    { imageId: 136, name: "Brown Stone Hills Under White Sky At Daytime" },
    { imageId: 191, name: "Mountain Road Through Dramatic Cliff Canyon" },
    { imageId: 564, name: "Antelope-Style Slot Canyon, Warm Light" },
    { imageId: 829, name: "Bryce Canyon Hoodoo Rock Formations" },
    { imageId: 884, name: "Desert Rock Formations Under Moonlit Sky" },
  ],
  rivers: [
    { imageId: 15, name: "Landscape Photography Of River And Trees" },
    { imageId: 466, name: "Forest Stream With Lush Green Vegetation" },
    { imageId: 506, name: "Dramatic Waterfall Cascading Over Rocks" },
    { imageId: 928, name: "Large Waterfall Cascading, Dramatic Power" },
    { imageId: 1035, name: "Person With Arms Raised At Waterfall, Dramatic" },
  ],
  lakes: [
    { imageId: 469, name: "Canoe On Calm Misty Water" },
    { imageId: 450, name: "Blue Fjord With Mountains, Panoramic" },
    { imageId: 477, name: "Lone Tree In Lake With Mountains" },
    { imageId: 794, name: "Sunset Over Mountain Lake Valley" },
    { imageId: 916, name: "Turquoise Mountain Lake, Aerial Panoramic" },
  ],
  mountains: [
    { imageId: 62, name: "Top View Of Mountain" },
    { imageId: 313, name: "Misty Mountain Landscape Layers" },
    { imageId: 544, name: "Foggy Mountain Valley, Dark And Moody" },
    { imageId: 806, name: "Blue Mountain Landscape With Clear Sky" },
    { imageId: 918, name: "Mountain Peaks At Sunset, Dramatic Clouds" },
  ],
  ocean: [
    { imageId: 10, name: "Aerial View Photography Of Green Trees Beside O..." },
    { imageId: 147, name: "Dark Ocean Water Waves" },
    { imageId: 349, name: "Man Beside Body Of Water Looking Toward Buildings" },
    { imageId: 638, name: "Ocean Waves On Sandy Beach, Aerial" },
    { imageId: 896, name: "Orange Sunset Over Calm Ocean Horizon" },
  ],
  coastal: [
    { imageId: 12, name: "Rippling Body Of Water Facing The Coastline" },
    { imageId: 271, name: "Aerial View Of Green Coastline And Blue Water" },
    { imageId: 381, name: "Coastal City Hills By Ocean Panorama" },
    { imageId: 612, name: "Large Wave Crashing On Coastal Rocks" },
    { imageId: 849, name: "Green Coastal Hillside With Road, Aerial" },
  ],
  harbors: [
    { imageId: 74, name: "Boat Near City Building During Daytime" },
    { imageId: 211, name: "Old Wooden Boat In Harbor, Vintage" },
    { imageId: 213, name: "Misty Pier At Sunset, Moody" },
    { imageId: 617, name: "Harbor Crane At Dusk, Industrial" },
    { imageId: 867, name: "Old Wooden Dock At Purple Sunset" },
  ],
  summer: [
    { imageId: 100, name: "Aerial View Of People Near Beach" },
    { imageId: 215, name: "Sandy Beach Landscape, Wide View" },
    { imageId: 845, name: "Surfer Silhouette At Sunset On Beach" },
    { imageId: 846, name: "Turquoise Ocean Wave Curl, Barrel" },
    { imageId: 1001, name: "Parent And Child Walking On Beach Dunes" },
  ],
  forests: [
    { imageId: 18, name: "Green Grass Meadow With Pine Trees" },
    { imageId: 216, name: "Forest Path Through Lush Green Trees" },
    { imageId: 543, name: "Forest Path Through Tall Pine Trees" },
    { imageId: 649, name: "Winding Road Through Pine Forest" },
    { imageId: 498, name: "Tall Redwood Trees Looking Up" },
  ],
  meadows: [
    { imageId: 109, name: "Wheat Grain Field In Warm Golden Light" },
    { imageId: 277, name: "Wheat Field Under Cloudy Dramatic Sky" },
    { imageId: 458, name: "Golden Grass Field At Sunset" },
    { imageId: 468, name: "Lone Tree In Golden Wheat Field" },
    { imageId: 921, name: "Green Meadow Landscape With Misty Sunrise" },
  ],
  architecture: [
    { imageId: 78, name: "Brown Concrete Building" },
    {
      imageId: 405,
      name: "Man Wearing White Shirt Standing Beside Brown C...",
    },
    { imageId: 616, name: "Ornate Architectural Dome Ceiling Interior" },
    { imageId: 898, name: "Tall Dark Skyscraper At Dusk, Urban" },
    { imageId: 952, name: "Skyscrapers Looking Up, Bw Perspective" },
  ],
  cityscapes: [
    { imageId: 173, name: "Orange Sunset Over City Skyline" },
    { imageId: 320, name: "Sunset Through City Buildings/Street" },
    { imageId: 371, name: "City Street With Traffic And Buses At Sunset" },
    { imageId: 496, name: "Person Silhouette Overlooking City Skyline" },
    { imageId: 797, name: "Red Umbrella On Rainy City Street At Night" },
  ],
  fashion: [
    { imageId: 21, name: "White High Heels On Red Wooden Surface" },
    { imageId: 22, name: "Man In Suit Crossing Empty Road, Overhead" },
    { imageId: 91, name: "Person Holding Camera, Wearing Dark Hoodie" },
    { imageId: 325, name: "Bare Feet Of Person In White Dress" },
    { imageId: 821, name: "Woman From Behind In White Dress, Minimal" },
  ],
  textures: [
    { imageId: 80, name: "Pine Cones On Reflective Surface, Bw" },
    { imageId: 101, name: "Gray Concrete House" },
    { imageId: 210, name: "Red Brick Wall Texture" },
    { imageId: 591, name: "Rocky Cliff Face Texture Close-Up" },
    { imageId: 766, name: "Coffee Beans Close-Up, Dark Roast Texture" },
  ],
  macro: [
    { imageId: 40, name: "Close-Up Photography Of Animal Nose" },
    { imageId: 73, name: "A Close Up Of A Person Holding A Baseball Bat" },
    { imageId: 115, name: "Rain Drops On Dark Window Glass" },
    { imageId: 977, name: "Small Mushroom In Green Moss, Macro" },
    { imageId: 309, name: "Green Leaf In Shallow Focus Shot" },
  ],
  abstract: [
    { imageId: 104, name: "White And Blue Dream Catcher" },
    {
      imageId: 223,
      name: "An Abstract Image Created Using Street Lights A...",
    },
    { imageId: 352, name: "Highway Light Trails At Night, Long Exposure" },
    { imageId: 951, name: "Colorful Striped Building Facade, Abstract" },
    { imageId: 1077, name: "Cyclists Racing, Motion Blur Bw" },
  ],
  interiors: [
    {
      imageId: 192,
      name: "Silhouette Of People Inside Room With Lights Tu...",
    },
    { imageId: 513, name: "Person In Cozy Cafe Interior, Warm Light" },
    { imageId: 625, name: "Modern Dining Room Interior, Wooden Table" },
    { imageId: 691, name: "Steaming Mug On Bedside Table, Bedroom" },
    { imageId: 775, name: "Person In Sunlit Abandoned Interior" },
  ],
  minimalist: [
    { imageId: 275, name: "Seagull On Railing, Minimalist White" },
    { imageId: 769, name: "Sunset Horizon Sky, Minimal, Dusk" },
    { imageId: 796, name: "Stones Scattered On Sand, Minimal" },
    { imageId: 922, name: "Foggy Dark Landscape, Bw Minimal" },
    { imageId: 954, name: "White Staircase Through Wall Opening, Minimal" },
  ],
  dark_moody: [
    { imageId: 25, name: "Tree Branches Silhouette Backlit By Sun" },
    {
      imageId: 310,
      name: "A Man Standing In The Dark With Smoke Coming Ou...",
    },
    { imageId: 399, name: "Couple Silhouette In Golden Sunset Light" },
    { imageId: 681, name: "Tree Silhouettes Against Twilight Sky" },
    { imageId: 793, name: "Cross Silhouette Against Dramatic Cloudy Sky" },
  ],
  misty: [
    { imageId: 94, name: "Misty Landscape With Green Trees, Faded" },
    { imageId: 220, name: "Foggy Street At Night With Glowing Lights" },
    { imageId: 472, name: "Fog And Mist Over Mountain Forest" },
    { imageId: 583, name: "Foggy Sunrise Over Clouds And Valley" },
    { imageId: 863, name: "Person Overlooking Misty Valley From Above" },
  ],
  roads: [
    { imageId: 17, name: "Road Surrounded By Green Leafed Trees" },
    { imageId: 183, name: "Car Driving Through Highway Tunnel" },
    { imageId: 335, name: "Curved Dirt Road" },
    { imageId: 413, name: "Closeup Photo Of Grasses Near Road" },
    { imageId: 688, name: "Green Mountain Road Through Valley Landscape" },
  ],
  sunsets: [
    { imageId: 110, name: "Lush Grass Field Photo During Golden Hour" },
    { imageId: 402, name: "Narrow Asian Street At Sunset, Warm Glow" },
    { imageId: 547, name: "Mountain Landscape At Golden Sunset" },
    { imageId: 695, name: "Dramatic Sunset Over Field And Landscape" },
    { imageId: 991, name: "Sunset Over Green Hillside, Golden Light" },
  ],
  nature: [
    { imageId: 11, name: "Green Grassfield" },
    { imageId: 59, name: "Brown Fence Near Green Grass" },
    { imageId: 255, name: "Bare Trees Surrounded By Green Grass Field" },
    { imageId: 542, name: "Green Pastoral Field With Fence And Clouds" },
    { imageId: 808, name: "Green Rolling Farmland Hills, Pastoral" },
  ],
};

export const ALL_THEME_IDS: ThemeId[] = Object.keys(PUZZLE_IMAGES) as ThemeId[];

const IMAGE_SIZE = 600;
const LOAD_TIMEOUT_MS = 8000;

export function getImageUrl(imageId: number): string {
  return `https://picsum.photos/id/${imageId}/${IMAGE_SIZE}/${IMAGE_SIZE}`;
}

export function preloadImage(imageId: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    const timer = setTimeout(() => {
      img.src = "";
      reject(
        new Error(`Image ${imageId} load timed out after ${LOAD_TIMEOUT_MS}ms`),
      );
    }, LOAD_TIMEOUT_MS);

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error(`Failed to load image ${imageId}`));
    };

    img.src = getImageUrl(imageId);
  });
}

export function preloadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    const timer = setTimeout(() => {
      img.src = "";
      reject(new Error("Image load timed out"));
    }, LOAD_TIMEOUT_MS);

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

export function getPuzzleImage(
  themeId: ThemeId,
  puzzleIndex: number,
): PuzzleImage | undefined {
  return PUZZLE_IMAGES[themeId]?.[puzzleIndex];
}
