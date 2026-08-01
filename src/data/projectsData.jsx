import {
    SiPython,
    SiJavascript,
    SiCplusplus,
    SiOpencv,
    SiArduino,
    SiBlazor,
    SiReact,
    SiAutocad,
    SiSwift,
    SiYoutube,
    SiAppstore,
    SiGoogleplay,
    SiVite,
    SiTensorflow,
    SiRaspberrypi,
    SiClaude
  } from 'react-icons/si';

import {
    FcElectronics,
    FcCheckmark,
    FcRadarPlot,
    FcGlobe
} from 'react-icons/fc';

import { 
    VscAzure,
    VscGithub
 }  from 'react-icons/vsc';

 import {
    FaLinkedin,
 } from 'react-icons/fa';

import {
    TbSql,
    TbBrandCSharp,
    TbBadge3D,
    TbProgress,
    TbCubeSpark,
    TbBrandCss3
} from 'react-icons/tb';

export const projects = [
    {
        id: 4,
        projectName: 'HackEurope 2026',
        location: 'Dublin, Ireland',
        codename: 'Aeolus',
        logo: '/assets/hackeu.webp',
        featured: true,
        technologyUsed: ['React', 'Javascript', 'Python', 'Vite', 'CSS', 'Claude'],
        type: ['Hackathon', 'Web'],
        role: 'API Developer, Backend Developer',
        blurb: 'HackEurope 2026 Hackathon Project.',
        status: 0,
        links: [
            {label: 'Website', url: 'https://windsite.cloud', site: 'Web'},
            {label: 'Devpost', url: 'https://devpost.com/software/windsite?ref_content=user-portfolio&ref_feature=in_progress', site: 'Web'},
            {label: 'Website Repository', url: 'https://github.com/MacManley/windsite.cloud', site: 'GitHub'},
            {label: 'Backend', url: 'https://github.com/MacManley/windsite-analysis', site: 'GitHub'}
        ],
        year: 2026
    },
    // {
    //     id: 1010,
    //     projectName: 'EuRoC 2026',
    //     // location: 'Portugal, Portugal',
    //     logo: '/assets/uccrses.webp',
    //     codename: 'Orpheus',
    //     featured: false,
    //     technologyUsed: ['Raspberry Pi', 'ESP32/ESP8266', 'C++', 'Arduino'],
    //     type: ['Hardware', 'Software'],
    //     role: 'AV Bay CAD Lead, Hardware Avionics Member',
    //     blurb: 'UCC RSES CAD & Programming.',
    //     status: 1,
    //     links: [],
    //     year: [2026]
    // },
    // {
    //     id: 1069,
    //     projectName: 'Rocketry Groundstation',
    //     // location: 'Campbeltown, Scotland',
    //     logo: '/assets/uccrses.webp',
    //     codename: 'Zenith',
    //     featured: false,
    //     technologyUsed: ['Raspberry Pi', 'ESP32/ESP8266', 'C++', 'Arduino'],
    //     type: ['Hardware', 'Software'],
    //     role: 'Project Lead',
    //     blurb: 'UCC RSES Proprietary Groundstation.',
    //     status: 1,
    //     links: [],
    //     year: 2026
    // },
    {
        id: 1000,
        projectName: 'Mach \'26',
        // location: 'Campbeltown, Scotland',
        logo: '/assets/uccrses.webp',
        codename: 'Cerberus',
        featured: false,
        technologyUsed: ['Raspberry Pi', 'ESP32/ESP8266', 'C++', 'Arduino'],
        type: ['Hardware', 'Software'],
        role: 'CanSat Lead, Hardware Avionics Member',
        blurb: 'UCC RSES CanSat & Programming.',
        status: 0,
        links: [],
        year: [2026]
    },
    {
        id: 1002,
        projectName: 'Grasshopper Flight Computer',
        // location: 'Downpatrick, Northern Ireland',
        logo: '/assets/uccrses.webp',
        codename: 'Theseus, Orthrus',
        featured: false,
        technologyUsed: ['Raspberry Pi', 'ESP32/ESP8266', 'C++', 'Arduino'],
        type: ['Hardware'],
        role: 'Lead of Hardware Avionics',
        blurb: 'UCC RSES SRAD Flight Computer and two-stage development.',
        status: 0,
        links: [],
        year: [2026]
    },
    {
        id: 8,
        projectName: 'Remento',
        location: 'Cork, Ireland',
        logo: '/assets/hea.webp',
        codename: 'Remento',
        featured: false,
        technologyUsed: ['Swift', 'Javascript'],
        type: ['Hackathon', 'Mobile'],
        role: 'Frontend Developer',
        blurb: 'Catching and monitoring elderly dementia.',
        status: 0,
        links: [
            {label: '2x Hackathon Winner', url: 'https://www.linkedin.com/posts/nathan-manley_amped-to-announce-remento-won-best-pitch-activity-7431676671654645760-XO68', site: 'Web'}
        ],
        year: 2026
    },
    {
        id: 9,
        projectName: 'Reeves',
        // location: 'Cork, Ireland',
        codename: 'Reeves',
        logo: '/assets/claude.webp',
        technologyUsed: ['Javascript', 'CSS', 'React', 'Vite'],
        type: ['Hackathon', 'Web'],
        role: 'Frontend Developer',
        blurb: 'The smart interview prepper.',
        status: 0,
        links: [
            {label: 'Claude Hackathon Winner', url: 'https://www.linkedin.com/posts/nathan-manley_the-glanmire-duo-strikes-again-this-time-ugcPost-7450842299825111041-FgN7', site: 'Web'},
            {label: 'Repository', url: 'https://github.com/MacManley/claude-hackathon/tree/main', site: 'GitHub'}
        ],
        year: 2026
    },
     {
        id: 6,
        projectName: 'OnSite',
        // location: 'Cork, Ireland',
        logo: '/assets/ucc.webp',
        codename: 'Geras',
        technologyUsed: ['Swift'],
        type: ['Mobile', "Software"],
        role: 'Founder',
        blurb: 'The all-in-one app for tradespeople.',
        status: 0,
        links: [
           {label: 'UCC SEOTY Finalist', url: '/', site: 'Web'},
           {label: 'iOS App', url: 'https://apps.apple.com/ie/app/onsite-trades/id6761440069', site: 'App'},
           {label: 'Marketing Website', url: 'https://onsite-trades.com', site: 'Web'},
           {label: 'Documentation Website', url: 'https://docs.onsite-trades.com', site: 'Web'}
        ],
        year: [2025, 2026]
    },
    {
        id: 1,
        projectName: 'Gymificient',
        // location: 'Dublin, Ireland',
        logo: '/assets/patch.webp',
        codename: 'Kratos',
        technologyUsed: ['Python', 'C#', 'OpenCV', 'Blazor', 'Azure', 'SQL', 'CSS'],
        type: ['Web', "Software"],
        role: 'Backend Engineer, Demo Day Pitcher',
        blurb: 'Patch 2024, actionable analytics for gyms.',
        status: 0,
        links: [
            {label: 'Gymificient Pitch', url: 'https://youtu.be/jycqwSAHBu0?feature=shared', site: 'Youtube'},
            {label: 'Gymificient CV Repository', url: 'https://github.com/MacManley/gymificientCV', site: 'GitHub'},
            {label: 'Gymificient Website Repository', url: 'https://github.com/jakubjn/Gymificient', site: 'GitHub'},
            {label: 'Gymificient Announcement Post', url: 'https://www.linkedin.com/posts/nathan-manley_over-the-last-6-weeks-of-patch-we-have-been-activity-7227266750562652160-L9se', site: 'LinkedIn'}
        ],
        year: 2024
    },
    {
        id: 2,
        projectName: 'GCC CanSat 2024',
        // location: 'Cork, Ireland',
        logo: '/assets/esa.webp',
        codename: 'Hephaestus',
        technologyUsed: ['3D Printing', 'Fusion 360', 'ESP32/ESP8266', 'Arduino', 'C++', 'Tensorflow', 'Python'],
        type: ["Software", "Hardware"],
        role: 'Lead 3D Design/Printing, Lead ML Engineer',
        blurb: 'Glanmire Community College \'24 CanSat.',
        status: 0,
        links: [
            {label: 'CanSat 2024 Repository', url: 'https://github.com/MacManley/cansat/tree/main/2024' , site: 'GitHub'},
        ],
        year: 2024
    },
    {
        id: 3,
        projectName: 'GCC CanSat 2023',
        // location: 'Laois, Ireland',
        logo: '/assets/esa.webp',
        codename: 'Janus',
        technologyUsed: ['3D Printing', 'Arduino', 'C++'],
        type: ["Software", "Hardware"],
        role: 'Lead Programmer, Lead 3D Printing',
        blurb: 'Glanmire Community College \'23 CanSat.',
        status: 0, // complete
        links: [
            {label: 'CanSat 2023 Repository', url: 'https://github.com/MacManley/cansat/tree/main/2023', site: 'GitHub'},
        ],
        year: 2023
    },
    {
        id: 5,
        projectName: 'UDP Telemetry Parsers',
        // location: 'Cork, Ireland',
        codename: 'Hermes',
        technologyUsed: ['C++', 'ESP32/ESP8266', 'Arduino', 'Python', 'Javascript'],
        type: ['Software', 'Hardware'],
        role: '',
        blurb: 'Parsing UDP telemetry from racing games.',
        status: 0,
        links: [
            {label: 'Libraries Collection', url: 'https://github.com/stars/MacManley/lists/esp32-esp8266-udp-telemetry', site: 'GitHub'},
            {label: 'GT7 UDP Plotly Visualiser', url: 'https://github.com/MacManley/gt7-track-visualizer', site: 'GitHub'},
            {label: 'GT7 Sport Mode Leaderboard Scraper', url: 'https://github.com/MacManley/gt7-leaderboards', site: 'GitHub'}
        ],
        year: [2023, 2026]
    },
    // {
    //     id: 69,
    //     projectName: 'seis',
    //     technologyUsed: ['Swift'],
    //     type: ['Software', 'Mobile'],
    //     role: '',
    //     blurb: 'Earthquake EEW',
    //     status: 2,
    //     links: [
    //         {label: 'App Store', url: '', site: 'App'},
    //     ],
    //     year: [2026]
    // },
    // {
    //     id: 12,
    //     projectName: 'Intelligent Desk Robot',
    //     technologyUsed: ['ESP32/ESP8266', 'Raspberry Pi', 'C++', 'Python'],
    //     type: ['Hardware'],
    //     role: '',
    //     blurb: '...',
    //     status: 2,
    //     links: [
    //         {},
    //     ],
    //     year: [2026]
    // },
    // {
    //     id: 1111,
    //     projectName: 'Portfolio Site',
    //     technologyUsed: ['React', 'Javascript', 'CSS', 'Vite'],
    //     role: '',
    //     blurb: 'Website to showcase projects and experience',
    //     status: 1, //ongoing
    //     links: [
    //         {label: 'Website Repository', url: '', site: 'GitHub'},
    //     ],
    //     year: [2025, 2026]
    // },
    // {
    //     id: 67,
    //     projectName: 'Ender 3V2 AMS',
    //     technologyUsed: ['Raspberry Pi', 'Fusion 360', '3D Printing'],
    //     type: ['Hardware'],
    //     role: '',
    //     blurb: "Custom Automatic Material System using Klipper",
    //     status: 2, //wip
    //     links: [
    //     ],
    //     year: 2026
    // },
    // {
    //     id: 7,
    //     projectName: 'VEX Robotics GCC',
    //     technologyUsed: ['C++'],
    //     role: 'Lead Programmer, Assistant Builder',
    //     blurb: 'Glanmire Community College 2023 Vex Robotics challenger',
    //     status: 0,
    //     links: [
    //         {label: 'GCC VEX Robotics Repository', url: '', site: 'Github'},
    //     ]
    //     // year: 2023
    // },
    // {
    //     id: 100,
    //     projectName: 'Leaving Certificate Project 2025',
    //     technologyUsed: ['3D Printing', 'Solidworks', 'Javascript'],
    //     role: '',
    //     blurb: 'A device for sorting and recycling batteries',
    //     status: 0,
    //     links: [
    //         {},
    //     ]
    //     // year: 2025
    // },

     // {
    //     id: 101,
    //     projectName: 'Toweler',
    //     technologyUsed: ['SwiftUI'],
    //     role: '',
    //     blurb: 'An app for saving water by giving advice to buyers about towels',
    //     status: 0
    // },

      // {
    //     id: 3000,
    //     projectName: 'M.E.D.S',
    //     technologyUsed: ['Arduino', 'C++', 'ESP8266'],
    //     role: 'Lead Programmer, Assitant Build',
    //     blurb: 'A device that dispenses dementia patients medicine and make sure they take it on time',
    //     status: 0
    // },

      // {
    //     id: 3001,
    //     projectName: 'Adaptive Smog Removal System',
    //     technologyUsed: ['Arduino, C++],
    //     role: 'Lead Programmer',
    //     blurb: 'Adaptive system that monitors smoke/VOC levels and adaptively removes and filters particulates from the building',
    //     status: 0
    // },
];

export const techIconMap = {
  'Python': <SiPython color="#3776AB" />,
  'Javascript': <SiJavascript color="#F7DF1E" />,
  'C++': <SiCplusplus color="#00599C" />,
  'C#': <TbBrandCSharp color="#9179E4" />,
  'OpenCV': <SiOpencv color="#5C3EE8" />,
  'Tensorflow': <SiTensorflow color="#ff5e00ff" />,
  'Claude': <SiClaude color="#DE7356"/>,
  'Arduino': <SiArduino color="#00979D" />,
  'Blazor': <SiBlazor color="#512BD4" />,
  'React': <SiReact color="#61DAFB" />,
  'Vite': <SiVite color="#DFC5FE"/>,
  'Azure': <VscAzure color='#3CCBF4' />,
  'SQL': <TbSql />,
  'Swift': <SiSwift color="#FFAC45" />,
  'CSS': <TbBrandCss3 color="#00599C"/>,
  'Fusion 360': <SiAutocad color="#ed742e"/>,
  'Solidworks': <TbCubeSpark color="#9e0000ff"/>,
  '3D Printing': <TbBadge3D />, // approximate; no official 3D print icon
  'ESP32/ESP8266': <FcElectronics /> , // no direct icon
  'Complete': <FcCheckmark />,
  'Ongoing': <FcRadarPlot />,
  'Web': <FcGlobe />,
  'Work In Progress': <TbProgress />,
  'GitHub': <VscGithub color="#ffffff"/>,
  'Youtube': <SiYoutube color="#f70531"/>,
  'LinkedIn': <FaLinkedin color="#3776AB"/>,
  'App': <SiAppstore />,
  'Play': <SiGoogleplay />,
  'Raspberry Pi': < SiRaspberrypi color="#f70531" />
};

export const statusLabels = ['Complete', 'Ongoing', 'Work In Progress'];

export const statusClassMap = {
    0: 'status-complete',
    1: 'status-ongoing',
    2: 'status-wip'
  };
