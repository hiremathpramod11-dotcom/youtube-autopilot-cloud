const fs = require('fs');
const path = require('path');

const calPath = path.join(__dirname, '..', 'data', '30_day_calendar.json');
const cal = JSON.parse(fs.readFileSync(calPath, 'utf8'));

const globalDays = [
  {
    day: 21,
    status: 'pending',
    scheduledDate: '2026-11-11T12:30:00.000Z',
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
    day: 22,
    status: 'pending',
    scheduledDate: '2026-11-12T12:30:00.000Z',
    title: 'What If Earth Stopped Spinning for Just 5 Seconds? 🌍⚡ | The Cataclysmic Simulation',
    topic: 'What If Earth Stopped Spinning Simulation',
    wikiTitles: ["Earth's_rotation", 'Atmosphere_of_Earth', 'Coriolis_force'],
    hook: 'Right now, you are hurtling through space at over one thousand miles per hour due to Earth\'s rotation. If the planet suddenly halted for just five seconds, the atmosphere would continue moving at supersonic speeds, wiping out entire continents in a heartbeat. Here is the second-by-second breakdown of what would actually happen.',
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
        narration: 'The sudden cessation of molten iron circulation in Earth\'s outer core would trigger violent earthquakes along every tectonic fault line, sparking super-volcanoes across the globe.'
      },
      {
        title: '4. The Restart: A Changed World',
        narration: 'When the rotation resumes, the friction between Earth\'s crust and the raging atmosphere would ignite colossal firestorms. It is a sobering reminder of the delicate cosmic balance keeping humanity alive.'
      }
    ],
    tags: ['What If', 'Earth Stopped Spinning', 'Science Simulation', 'Space Mysteries', 'Cosmic Catastrophe', 'Physics', 'Aperture']
  },
  {
    day: 23,
    status: 'pending',
    scheduledDate: '2026-11-13T12:30:00.000Z',
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
        narration: 'Was it designed by Archimedes, Posidonius, or a lost school of ancient engineers? To this day, the true origin of the world\'s oldest computer remains one of history\'s greatest enigmas.'
      }
    ],
    tags: ['Antikythera Mechanism', 'Ancient Technology', 'Archaeology', 'Ancient History', 'Lost Civilizations', 'Unsolved Mysteries']
  },
  {
    day: 24,
    status: 'pending',
    scheduledDate: '2026-11-14T12:30:00.000Z',
    title: 'The Bermuda Triangle: What Science Finally Discovered ✈️🌊 | Unexplained Phenomena',
    topic: 'Bermuda Triangle Scientific Investigation',
    wikiTitles: ['Bermuda_Triangle', 'Flight_19', 'Methane_clathrate'],
    hook: 'Over seventy-five aircraft and hundreds of ships have vanished without a trace inside the fifty-thousand square mile expanse between Miami, Bermuda, and Puerto Rico. Compass anomalies, rogue waves, and underwater methane blowouts have all been blamed. Here is what modern marine scientists and satellite radars actually uncovered.',
    sections: [
      {
        title: '1. The Ghost Fleets and Flight 19',
        narration: 'In 1945, five US Navy bombers vanished over the Atlantic. The rescue plane sent to find them vanished as well. No wreckage or debris was ever recovered.'
      },
      {
        title: '2. Rogue Waves and the Puerto Rico Trench',
        narration: 'Oceanographers have documented one-hundred-foot rogue waves forming where storms converge from three directions, capable of snapping commercial cargo ships in two within seconds.'
      },
      {
        title: '3. Underwater Methane Blowouts',
        narration: 'Massive undersea pockets of methane hydrate can rupture, drastically lowering water density so ships sink instantly without floating buoyancy.'
      },
      {
        title: '4. What Science Concluded',
        narration: 'While statistics show traffic density explains many losses, the localized electromagnetic anomalies and sudden squalls continue to make this stretch of ocean one of the most unpredictable on Earth.'
      }
    ],
    tags: ['Bermuda Triangle', 'Ocean Mysteries', 'Flight 19', 'Unexplained Phenomena', 'Science Facts', 'Documentary']
  },
  {
    day: 25,
    status: 'pending',
    scheduledDate: '2026-11-15T12:30:00.000Z',
    title: 'The James Webb Telescope Just Found Something That Breaks Physics 🔭🌌 | Cosmic Wonders',
    topic: 'James Webb Space Telescope Cosmic Mysteries',
    wikiTitles: ['James_Webb_Space_Telescope', 'Early_galaxies', 'Cosmic_dawn'],
    hook: 'Peering over thirteen billion years into the past, NASA\'s James Webb Space Telescope detected massive, fully formed galaxies at the very dawn of time. According to current cosmological models, these giant structures should not even exist. Are our fundamental laws of the universe wrong?',
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
    day: 26,
    status: 'pending',
    scheduledDate: '2026-11-16T12:30:00.000Z',
    title: "The Unsolved Enigma of the Great Pyramid's Hidden Chamber 🗿😱 | Ancient Engineering",
    topic: 'Great Pyramid of Giza Cosmic Ray Scan',
    wikiTitles: ['Great_Pyramid_of_Giza', 'ScanPyramids', 'Khufu'],
    hook: 'Built from over 2.3 million stone blocks weighing up to eighty tons each, the Great Pyramid of Giza has stood for four thousand five hundred years. In 2017, cosmic-ray muon detectors revealed a massive, previously unknown void deep inside the stone core. What is sealed inside this hundred-foot-long chamber?',
    sections: [
      {
        title: '1. The Muon Radiography Breakthrough',
        narration: 'Using elementary particle physics that capture cosmic rays passing through rock, researchers confirmed a massive secret corridor spanning over one hundred feet directly above the Grand Gallery.'
      },
      {
        title: '2. Unprecedented Engineering Precision',
        narration: 'The pyramid is aligned to true north with an accuracy of within four-sixtieths of a degree—an achievement modern architects struggle to replicate without GPS and laser gyroscopes.'
      },
      {
        title: '3. Acoustic and Electromagnetic Resonances',
        narration: 'Physics experiments demonstrate that the pyramid concentrates electromagnetic energy in its internal chambers and underneath its limestone base.'
      },
      {
        title: '4. What Lies Inside the Void?',
        narration: 'Endoscopic cameras and robotic probes are now being prepared to peer through millimeters of stone, promising to unlock one of archaeology\'s ultimate secrets.'
      }
    ],
    tags: ['Pyramids of Giza', 'Ancient Egypt', 'ScanPyramids', 'Archaeology', 'Ancient Megaliths', 'Lost Civilizations']
  },
  {
    day: 27,
    status: 'pending',
    scheduledDate: '2026-11-17T12:30:00.000Z',
    title: 'The Forbidden Island Nobody Is Allowed to Visit: North Sentinel Island 🏝️🏹 | World Mysteries',
    topic: 'North Sentinel Island Isolated Civilization',
    wikiTitles: ['North_Sentinel_Island', 'Sentinelese', 'Andaman_Islands'],
    hook: 'Isolated in the Indian Ocean lies an island where modern civilization is strictly prohibited by law. The Sentinelese people have lived here in complete isolation for over sixty thousand years, completely cut off from the rest of humanity. Why does the world leave them alone, and what is life like on the last untouched island on Earth?',
    sections: [
      {
        title: '1. The Last Pre-Neolithic Society',
        narration: 'The Sentinelese speak an unclassified language, make tools from ocean flotsam, and have repelled outside contact for millennia with a fierce defense of their borders.'
      },
      {
        title: '2. The 2004 Tsunami Survival Miracle',
        narration: 'When the massive Indian Ocean tsunami wiped out modern towns across Southeast Asia, observers feared the islanders were extinct. Yet aerial helicopters found them completely unharmed, having moved to high ground via ancient tribal knowledge.'
      },
      {
        title: '3. The Global Exclusion Zone',
        narration: 'Governments enforce a strict five-nautical-mile perimeter around the island. Because the Sentinelese lack immunity to common global pathogens, a simple cold could wipe out their entire civilization.'
      },
      {
        title: '4. A Living Window Into Human History',
        narration: 'North Sentinel Island remains a pristine sanctuary reminding us that on a hyper-connected planet, genuine mystery and human independence still endure.'
      }
    ],
    tags: ['North Sentinel Island', 'Sentinelese', 'Isolated Tribes', 'World Mysteries', 'Forbidden Places', 'Anthropology']
  },
  {
    day: 28,
    status: 'pending',
    scheduledDate: '2026-11-18T12:30:00.000Z',
    title: 'What If a Rogue Black Hole Entered Our Solar System? 🕳️💥 | Cosmic Simulation',
    topic: 'Rogue Black Hole Solar System Simulation',
    wikiTitles: ['Black_hole', 'Rogue_planet', 'Stellar_black_hole'],
    hook: 'Silently drifting through the interstellar void, rogue black holes cannot be seen directly because no light escapes them. If one entered our solar system within the orbit of Neptune, the gravitational tidal forces would immediately disrupt planetary orbits, fling asteroids across the sky, and distort space-time itself. Here is how the end of our solar system would unfold.',
    sections: [
      {
        title: '1. Silent Invisible Inbound Hazard',
        narration: 'Unlike shining stars, an isolated stellar-mass black hole has no accretion disk. We would only detect it when distant background stars appear warped by gravitational lensing.'
      },
      {
        title: '2. Chaos in the Outer Solar System',
        narration: 'As it crosses the Kuiper Belt, trillions of frozen comets and asteroids would be thrown into wild trajectories, showering Earth with relentless meteor strikes.'
      },
      {
        title: '3. Earth\'s Orbit Torn Apart',
        narration: 'The black hole\'s gravity would easily overpower the Sun\'s grip, ejecting Earth into deep space as a frozen wanderer, or pulling our planet into an elliptical death spiral.'
      },
      {
        title: '4. The Ultimate Cosmic Force',
        narration: 'While the odds of a black hole striking our solar system are astronomically low, millions of these invisible wanderers roam our galaxy, shaping the cosmos in silence.'
      }
    ],
    tags: ['Black Holes', 'What If', 'Space Simulation', 'Astronomy', 'Cosmic Wonders', 'Physics Documentary']
  },
  {
    day: 29,
    status: 'pending',
    scheduledDate: '2026-11-19T12:30:00.000Z',
    title: 'The Mysterious Acoustic Hum Heard Worldwide: The Taos Hum 🔊🌍 | Global Anomalies',
    topic: 'Taos Hum Global Acoustic Mystery',
    wikiTitles: ['The_Hum', 'Infrasound', 'Acoustic_resonance'],
    hook: 'In towns across the world, from Taos, New Mexico to Bristol, England, thousands of residents have reported hearing an inescapable, low-frequency humming sound that vibrates inside their homes. Microphones struggle to record it, yet it drives those who hear it to madness. Is it industrial infrasound, military communication, or a geological anomaly?',
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
        narration: 'Decades after it was first reported, The Hum remains one of modern science\'s most baffling acoustic puzzles.'
      }
    ],
    tags: ['The Hum', 'Taos Hum', 'Acoustic Mysteries', 'Unsolved Mysteries', 'Science Facts', 'Weird Earth']
  },
  {
    day: 30,
    status: 'pending',
    scheduledDate: '2026-11-20T12:30:00.000Z',
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

// Replace pending days 21 to 30 with global days
const updatedCal = cal.filter(c => c.day < 21);
updatedCal.push(...globalDays);

fs.writeFileSync(calPath, JSON.stringify(updatedCal, null, 2), 'utf8');
console.log('✅ Successfully replaced Days 21-30 with Global Curiosities & Mysteries!');
