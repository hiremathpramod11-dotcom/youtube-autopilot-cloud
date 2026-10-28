const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const calPath = path.join(__dirname, '..', 'data', '30_day_calendar.json');

// Fetch upstream origin/main calendar
const remoteCalJson = execSync('git show origin/main:data/30_day_calendar.json', { cwd: path.join(__dirname, '..') }).toString('utf8');
const remoteCal = JSON.parse(remoteCalJson);

const days1to20 = remoteCal.filter(c => c.day <= 20);
const day21 = remoteCal.find(c => c.day === 21);
const day22 = remoteCal.find(c => c.day === 22);
const day23 = remoteCal.find(c => c.day === 23);
const day25 = remoteCal.find(c => c.day === 25);

const englishTopics = [
  {
    day: 24,
    status: 'pending',
    scheduledDate: '2026-11-14T12:30:00.000Z',
    title: 'The Terrifying Secrets Hidden at the Bottom of the Mariana Trench! 😱🌊 | Deep Ocean Abyss',
    topic: 'Mariana Trench Deep Abyss Mysteries',
    wikiTitles: ['Mariana_Trench', 'Challenger_Deep', 'Abyssal_zone'],
    hook: 'Nearly seven miles beneath the ocean surface lies a pitch-black abyss where sunlight has never reached. The pressure here would crush a submarine like a soda can, yet strange creatures and unexplained sounds have baffled scientists for decades. Here is what we found at the very bottom of the Earth.',
    sections: [
      {
        title: '1. The Challenger Deep: Where Physics Breaks Down',
        narration: 'At nearly thirty-six thousand feet down, water exerts over one thousand times atmospheric pressure. Any standard vessel would implode instantly, yet robotic probes discovered an alien ecosystem thriving in the dark.'
      },
      {
        title: '2. Creatures of the Hadal Zone: Living in Liquid Armor',
        narration: 'From translucent snailfish with anti-pressure enzymes to giant amphipods, life here evolved mechanisms that defy conventional biology. But what shocked marine biologists was something else entirely.'
      },
      {
        title: '3. The Unexplained Metallic Acoustic Signals',
        narration: 'Hydrophones anchored in the trench have repeatedly captured low-frequency rhythmic acoustic hums. While some attribute them to baleen whales or tectonic fractures, others suspect geological resonance in unexplored subduction zones.'
      },
      {
        title: '4. The Final Frontier on Earth',
        narration: 'We know more about the surface of Mars and the Moon than we do about the floor of our own oceans. As deep-sea exploration accelerates, the Mariana Trench continues to reveal secrets that challenge our understanding of life itself.'
      }
    ],
    tags: ['Mariana Trench', 'Ocean Mysteries', 'Deep Sea Creatures', 'Challenger Deep', 'Science Documentary', 'Unsolved Mysteries', 'Abyss', 'What If']
  },
  {
    day: 26,
    status: 'pending',
    scheduledDate: '2026-11-16T12:30:00.000Z',
    title: 'What If Earth Stopped Spinning for Just 5 Seconds? 🌍⚡ | The Cataclysmic Simulation',
    topic: 'What If Earth Stopped Spinning Simulation',
    wikiTitles: ["Earth's_rotation", 'Atmosphere_of_Earth', 'Coriolis_force'],
    hook: "Right now, you are hurtling through space at over one thousand miles per hour due to Earth's rotation. If the planet suddenly halted for just five seconds, the atmosphere would continue moving at supersonic speeds, wiping out entire continents in a heartbeat. Here is the second-by-second breakdown of what would actually happen.",
    sections: [
      {
        title: '1. Second 1: The Supersonic Atmospheric Shockwave',
        narration: 'At the equator, everything not anchored to bedrock—buildings, oceans, and vehicles—would be hurled eastward at over a thousand miles per hour by sheer inertia.'
      },
      {
        title: '2. Seconds 2 to 3: The Ocean Megatsunami',
        narration: 'Water from the oceans would rush towards the poles, stripping entire coastal regions down to bare rock and reshaping global geography in less than three seconds.'
      },
      {
        title: '3. Seconds 4 to 5: Magnetic and Geothermal Collapse',
        narration: "The sudden cessation of molten iron circulation in Earth's outer core would trigger violent earthquakes along every tectonic fault line, sparking super-volcanoes across the globe."
      },
      {
        title: '4. The Restart: A Changed World',
        narration: 'When the rotation resumes, the friction between Earth\'s crust and the raging atmosphere would ignite colossal firestorms. It is a sobering reminder of the delicate cosmic balance keeping humanity alive.'
      }
    ],
    tags: ['What If', 'Earth Stopped Spinning', 'Science Simulation', 'Space Mysteries', 'Cosmic Catastrophe', 'Physics', 'Aperture']
  },
  {
    day: 27,
    status: 'pending',
    scheduledDate: '2026-11-17T12:30:00.000Z',
    title: 'The 2,000-Year-Old Ancient Computer: The Antikythera Mechanism ⚙️🏛️ | Unsolved Archaeology',
    topic: 'Antikythera Mechanism Ancient Computer',
    wikiTitles: ['Antikythera_mechanism', 'Ancient_Greek_technology', 'Antikythera_wreck'],
    hook: 'In 1901, divers exploring a Roman shipwreck found a corroded bronze artifact with precision bronze gears. It turned out to be an analog computer built over two thousand years ago that accurately tracked planetary motions and eclipses with technology not seen again until the 14th century. How did ancient humans build this?',
    sections: [
      {
        title: '1. The Aegean Shipwreck Discovery',
        narration: 'Sponge divers off the coast of Antikythera brought up statues, coins, and a strange lump of petrified bronze that nobody could explain for over fifty years.'
      },
      {
        title: '2. 3D X-Ray Tomography: Decoding the 37 Gears',
        narration: 'Modern micro-focus X-rays revealed thirty-seven interlocking bronze gears with triangular teeth less than two millimeters wide, capable of calculating lunar phases and planetary orbits.'
      },
      {
        title: '3. Lost Knowledge of the Ancient World',
        narration: 'Nothing of this mechanical complexity was manufactured again until clockmakers in medieval Europe over a thousand years later. It proves ancient civilization was far more technologically advanced than previously imagined.'
      },
      {
        title: '4. The Unsolved Mastermind',
        narration: "Was it designed by Archimedes, Posidonius, or a lost school of ancient engineers? To this day, the true origin of the world's oldest computer remains one of history's greatest enigmas."
      }
    ],
    tags: ['Antikythera Mechanism', 'Ancient Technology', 'Archaeology', 'Ancient History', 'Lost Civilizations', 'Unsolved Mysteries']
  },
  {
    day: 28,
    status: 'pending',
    scheduledDate: '2026-11-18T12:30:00.000Z',
    title: 'The Bermuda Triangle: What Science Finally Discovered ✈️🌊 | Unexplained Phenomena',
    topic: 'Bermuda Triangle Scientific Investigation',
    wikiTitles: ['Bermuda_Triangle', 'Flight_19', 'Methane_clathrate'],
    hook: 'Over seventy-five aircraft and hundreds of ships have vanished without a trace inside the fifty-thousand square mile expanse between Miami, Bermuda, and Puerto Rico. Compass anomalies, rogue waves, and underwater methane blowouts have all been blamed. Here is what modern marine scientists and satellite radars actually uncovered.',
    sections: [
      {
        title: '1. The Vanishing of Flight 19',
        narration: 'In 1945, five US Navy bombers flew into the Bermuda Triangle on a routine training mission and completely vanished after reported compass failures. The rescue plane sent to find them disappeared as well.'
      },
      {
        title: '2. The Hexagonal Cloud Bombs',
        narration: 'Satellite radar imagery revealed microburst hexagonal cloud formations capable of generating eighty-foot rogue waves and hurricane-force winds of one hundred and seventy miles per hour in seconds.'
      },
      {
        title: '3. Underwater Methane Explosions',
        narration: 'Huge deposits of methane hydrates beneath the seabed can erupt violently, drastically lowering water density and causing vessels to sink instantly without time to send a distress call.'
      },
      {
        title: '4. The Verdict of Modern Science',
        narration: "While statistics show traffic density explains much of the loss rate, the Bermuda Triangle remains a stark demonstration of nature's unpredictable fury in the open ocean."
      }
    ],
    tags: ['Bermuda Triangle', 'Ocean Mysteries', 'Flight 19', 'Science Documentary', 'Rogue Waves', 'Unsolved Mysteries']
  },
  {
    day: 29,
    status: 'pending',
    scheduledDate: '2026-11-19T12:30:00.000Z',
    title: 'The James Webb Telescope Just Found Something That Breaks Physics 🔭🌌 | Cosmic Wonders',
    topic: 'James Webb Space Telescope Cosmic Mysteries',
    wikiTitles: ['James_Webb_Space_Telescope', 'Early_galaxies', 'Cosmic_dawn'],
    hook: "Peering over thirteen billion years into the past, NASA's James Webb Space Telescope detected massive, fully formed galaxies at the very dawn of time. According to current cosmological models, these giant structures should not even exist. Are our fundamental laws of the universe wrong?",
    sections: [
      {
        title: '1. The Cosmic Dawn Anomalies',
        narration: 'Just three hundred million years after the Big Bang, astronomers expected to see faint, fragile baby stars. Instead, Webb photographed colossal spiral galaxies glowing with the brightness of hundreds of billions of suns.'
      },
      {
        title: '2. Defying the Standard Model of Cosmology',
        narration: 'There was simply not enough cosmic time for stars to aggregate into structures of this mass. Cosmologists are now questioning dark matter models and galaxy formation rates.'
      },
      {
        title: '3. Primordial Monster Black Holes',
        narration: 'Even more puzzling is the presence of supermassive black holes millions of times the mass of our sun already ruling these early galaxies, suggesting black holes formed before stars.'
      },
      {
        title: '4. A Paradigm Shift in Astronomy',
        narration: 'James Webb is not just taking pictures—it is dismantling decades of textbook physics and opening a new era of cosmic discovery.'
      }
    ],
    tags: ['James Webb Telescope', 'JWST', 'Space Documentary', 'Cosmology', 'Astronomy', 'Black Holes', 'NASA']
  },
  {
    day: 30,
    status: 'pending',
    scheduledDate: '2026-11-20T12:30:00.000Z',
    title: 'The Unsolved Enigma of the Great Pyramid Muon Void 🏛️⚡ | Ancient High Technology',
    topic: 'Great Pyramid Muon Void Discovery',
    wikiTitles: ['Great_Pyramid_of_Giza', 'ScanPyramids', 'Muon_tomography'],
    hook: "In 2017, particle physicists firing cosmic ray muons through the Great Pyramid of Giza detected a massive, sealed void at least one hundred feet long sitting undisturbed directly above the Grand Gallery. To this day, no human eye has seen inside. What was deliberately concealed inside the ancient world's greatest wonder?",
    sections: [
      {
        title: '1. Muon Radiography: Seeing Through Solid Stone',
        narration: 'By measuring the rate at which cosmic subatomic particles penetrate two million multi-ton limestone blocks, the ScanPyramids team proved the existence of an immense hollow space.'
      },
      {
        title: '2. The Structure of the Big Void',
        narration: 'The void mirrors the slope and dimensions of the magnificent Grand Gallery beneath it. Some believe it served as a stress-relieving architectural chamber, while others suspect a lost archival repository.'
      },
      {
        title: '3. Non-Invasive Exploration Dilemma',
        narration: 'Because the Egyptian Ministry of Antiquities forbids destructive drilling into the core, scientists are developing microscopic endoscopic drones capable of flying through keyhole cracks.'
      },
      {
        title: '4. Secrets of the Pharaohs',
        narration: 'Four and a half thousand years after its completion, the Great Pyramid still holds unopened chambers that could rewrite the history of early civilization.'
      }
    ],
    tags: ['Great Pyramid', 'Giza Pyramids', 'ScanPyramids', 'Ancient Egypt', 'Muon Scan', 'Archaeology', 'Lost History']
  },
  {
    day: 31,
    status: 'pending',
    scheduledDate: '2026-11-21T12:30:00.000Z',
    title: 'The Forbidden Island Nobody Is Allowed to Visit: North Sentinel Island 🏝️🏹',
    topic: 'North Sentinel Island Isolated Tribe',
    wikiTitles: ['North_Sentinel_Island', 'Sentinelese', 'Andaman_Islands'],
    hook: "In the middle of the Indian Ocean lies a dense tropical island completely cut off from the modern world. Its inhabitants have violently resisted all outside contact for over sixty thousand years. Approaching within five miles is strictly illegal. Here is what we know about humanity's last truly isolated society.",
    sections: [
      {
        title: '1. Sixty Thousand Years of Isolation',
        narration: 'The Sentinelese are believed to be direct descendants of the earliest humans to migrate out of Africa, living entirely self-sufficiently through fishing and hunting.'
      },
      {
        title: '2. Deadly Encounters and Failed Contact',
        narration: 'From shipwreck survivors in the 19th century to National Geographic teams and unauthorized travelers, virtually every attempt to land has been met with showers of lethal iron-tipped arrows.'
      },
      {
        title: '3. Surviving the 2004 Indian Ocean Tsunami',
        narration: 'When the catastrophic 2004 tsunami devastated Indian Ocean coastlines, observers feared the islanders were wiped out. But when navy helicopters surveyed the island, warriors emerged onto the beach firing arrows at the aircraft—having sensed the seismic shifts and retreated safely into the highlands.'
      },
      {
        title: '4. The Policy of Total Quarantine',
        narration: 'The Indian government strictly enforces a maritime exclusion zone. Because the tribe lacks immunity to modern diseases like the common cold, contact could trigger complete extinction.'
      }
    ],
    tags: ['North Sentinel Island', 'Isolated Tribes', 'Forbidden Places', 'Uncontacted Peoples', 'Anthropology', 'Mystery Island']
  },
  {
    day: 32,
    status: 'pending',
    scheduledDate: '2026-11-22T12:30:00.000Z',
    title: 'What If a Rogue Black Hole Entered Our Solar System? 🕳️🌌 | Cosmic Catastrophe',
    topic: 'Rogue Black Hole Inbound Simulation',
    wikiTitles: ['Black_hole', 'Rogue_planet', 'Solar_System'],
    hook: "Roaming silently through interstellar space are trillions of invisible stellar-mass black holes, completely untethered to any star. If one of these cosmic monsters were heading toward our solar system right now, we would not see it until it had already destabilized the orbits of the planets. Here is how humanity's final months would unfold.",
    sections: [
      {
        title: '1. Year 1: Gravitational Disruption in the Oort Cloud',
        narration: 'Long before the black hole reached the inner planets, its gravitational distortion would send millions of icy comets hurtling inward like celestial artillery.'
      },
      {
        title: '2. Month 6: Warping the Orbits of Gas Giants',
        narration: 'As it crossed Saturn and Jupiter, planetary orbits would be sheared into chaotic eccentric loops, destabilizing the Goldilocks zone that keeps Earth habitable.'
      },
      {
        title: '3. Month 1: Gravitational Lensing and Ocean Surges',
        narration: 'Looking into the night sky, stars would warp into surreal swirling halos of light. The tidal gravitational forces would raise five-mile-high oceanic bulges across Earth.'
      },
      {
        title: '4. The Inevitable Horizon',
        narration: "Whether Earth is ejected into the freezing void of deep space or torn apart by spaghettification, the arrival of a rogue black hole is nature's ultimate cosmic reset button."
      }
    ],
    tags: ['Black Hole', 'Space Simulation', 'Cosmic Catastrophe', 'What If', 'Astrophysics', 'Aperture', 'Science Documentary']
  },
  {
    day: 33,
    status: 'pending',
    scheduledDate: '2026-11-23T12:30:00.000Z',
    title: 'The Mysterious Acoustic Hum Heard Worldwide: The Taos Hum 🔊🌍 | Unsolved Audio Paradox',
    topic: 'The Taos Hum Acoustic Anomaly',
    wikiTitles: ['The_Hum', 'Taos,_New_Mexico', 'Infrasound'],
    hook: 'In towns across the United States, Britain, and Germany, thousands of residents report hearing an unrelenting low-frequency droning sound that penetrates concrete walls and noise-canceling headphones. It has driven people to insomnia and mental exhaustion, yet microphones detect total silence. What is the Hum, and why can only certain people hear it?',
    sections: [
      {
        title: '1. The Sound That Drives People Crazy',
        narration: 'Described as the low rumble of a distant diesel engine idling, the hum is loudest inside enclosed rooms and at night, yet only two percent of the population can perceive it.'
      },
      {
        title: '2. Scientific Field Investigations',
        narration: 'Acoustic teams in New Mexico installed highly sensitive seismic and electromagnetic sensors. Despite thousands of hours of recordings, no external acoustic source was ever verified.'
      },
      {
        title: '3. Submarine Transmitters or Earth Crust Resonance?',
        narration: 'Hypotheses range from military Very Low Frequency transmitters communicating with submarines, to acoustic waves generated by colliding ocean waves resonating through the continental crust.'
      },
      {
        title: '4. An Unresolved Audio Enigma',
        narration: "Decades after it was first reported, The Hum remains one of modern science's most baffling acoustic puzzles."
      }
    ],
    tags: ['The Hum', 'Taos Hum', 'Acoustic Mysteries', 'Unsolved Mysteries', 'Science Facts', 'Weird Earth']
  },
  {
    day: 34,
    status: 'pending',
    scheduledDate: '2026-11-24T12:30:00.000Z',
    title: 'Top 5 Ancient Megalithic Structures That Defy Modern Technology 🗿⚡ | Megalithic Mysteries',
    topic: 'Megalithic Architecture Precision Stone Engineering',
    wikiTitles: ['Megalith', 'Baalbek', 'Puma_Punku', 'Saksaywaman'],
    hook: 'From the thousand-ton stones of Baalbek to the interlocking geometric blocks of Puma Punku and Sacsayhuamán, ancient stone masonry displays precision cuts, acoustic alignments, and transport methods that challenge the capabilities of modern construction cranes. How were these colossal blocks quarried, moved, and fitted so tightly that a razor blade cannot fit between them?',
    sections: [
      {
        title: '1. Baalbek: The 1,000-Ton Megaliths of Lebanon',
        narration: 'At the Temple of Jupiter, three foundation stones known as the Trilithon weigh over eight hundred tons each, quarried and raised twenty-three feet above the ground with unexplained ancient machinery.'
      },
      {
        title: '2. Puma Punku: Machine-Like Andesite Blocks',
        narration: 'In Bolivia, ancient builders carved extremely hard andesite diorite into complex H-blocks with millimeter-perfect right angles and smooth interior drill holes.'
      },
      {
        title: '3. Sacsayhuamán: Earthquake-Proof Polygonal Walls',
        narration: 'Near Cusco, stones weighing up to one hundred and twenty tons fit together with interlocking organic curves without mortar, surviving centuries of violent Andean earthquakes.'
      },
      {
        title: '4. The Lost Science of Ancient Stonework',
        narration: 'These monuments stand across multiple continents as silent evidence that our ancestors mastered physics and engineering techniques that have been lost to the sands of time.'
      }
    ],
    tags: ['Ancient Megaliths', 'Baalbek', 'Puma Punku', 'Ancient Engineering', 'Lost Technology', 'Archaeology']
  }
];

const finalCalendar = [
  ...days1to20,
  day21,
  day22,
  day23,
  englishTopics[0], // Day 24 (pending English)
  day25,            // Day 25 (scheduled on remote)
  ...englishTopics.slice(1) // Days 26 through 34 (all pending English)
];

finalCalendar.sort((a, b) => a.day - b.day);

fs.writeFileSync(calPath, JSON.stringify(finalCalendar, null, 2), 'utf8');
console.log('✓ Calendar resolved successfully! Total days:', finalCalendar.length);
console.log('Scheduled/Published days:', finalCalendar.filter(c => c.status === 'scheduled' || c.status === 'published').length);
console.log('Pending English days:', finalCalendar.filter(c => c.status === 'pending').length);
