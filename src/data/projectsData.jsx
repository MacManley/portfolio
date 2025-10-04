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
    SiLinkedin,
    SiCss3,
    SiAppstore,
    SiGoogleplay,
    SiVite
  } from 'react-icons/si';

import {
    FcElectronics,
    FcCheckmark,
    FcRadarPlot
} from 'react-icons/fc';

import { 
    VscAzure,
    VscGithub
 }  from 'react-icons/vsc';

import {
    TbSql,
    TbBrandCSharp,
    TbBadge3D,
    TbProgress
} from 'react-icons/tb';

export const projects = [
    {
        id: 1,
        projectName: 'Gymificient',
        technologyUsed: ['Python', 'C#', 'OpenCV', 'Blazor', 'Azure', 'SQL', 'CSS'],
        role: 'Back-end Engineer, Demo Day Pitcher',
        blurb: 'Patch 2024 Project, providing actionable analytics for gym owners',
        status: 0,
        links: [
            {label: 'Gymificient Website Repository', url: 'https://github.com/jakubjn/Gymificient', site: 'Github'},
            {label: 'Gymificient Computer Vision Repository', url: 'https://github.com/MacManley/gymificientCV', site: 'Github'},
            {label: 'Gymificient Pitch', url: 'https://youtu.be/jycqwSAHBu0?feature=shared', site: 'Youtube'},
            {label: 'Gymificient Announcement Post', url: 'https://www.linkedin.com/posts/nathan-manley_over-the-last-6-weeks-of-patch-we-have-been-activity-7227266750562652160-L9se', site: 'LinkedIn'}
        ]
        // year: 2024
    },
    {
        id: 2,
        projectName: 'CanSat 2024',
        technologyUsed: ['3D Printing', 'Fusion 360', 'ESP8266', 'Arduino', 'C++'],
        role: 'Lead 3D Design, Lead 3D Printing, Assistant Builder',
        blurb: 'Glanmire Community College 2024 CanSat "Candromeda"',
        status: 0,
        links: [
            {label: 'CanSat 2024 Repository', url: 'https://github.com/MacManley/cansat/tree/main/2024' , site: 'Github'},
            {label: '', url: '', site: ''}
        ]
        // year: 2024
    },
    {
        id: 3,
        projectName: 'CanSat 2023',
        technologyUsed: ['3D Printing', 'Arduino', 'C++'],
        role: 'Lead Programmer, Lead 3D Printing',
        blurb: 'Glanmire Community College 2023 CanSat "Candromeda"',
        status: 0, // complete
        links: [
            {label: 'CanSat 2023 Repository', url: 'https://github.com/MacManley/cansat/tree/main/2023', site: 'Github'},
            {label: '', url: '', site: ''}
        ]
        // year: 2023
    },

    {
        id: 4,
        projectName: 'Portfolio Site',
        technologyUsed: ['React', 'Javascript', 'CSS', 'Vite'],
        role: '',
        blurb: 'Website to showcase technical and practical experience',
        status: 2, //wip
        links: [
            {label: 'Website Repository', url: '', site: 'Github'},
        ]
        // year: 2025
    },
    {
        id: 5,
        projectName: 'Game Telemetry Parsers',
        technologyUsed: ['C++', 'ESP8266', 'Arduino', 'Python', 'Javascript'],
        role: '',
        blurb: 'Libraries for parsing UDP telemtry data from simulation games',
        status: 1, //active
        links: [
            {label: 'ESP8266/ESP32 Libraries Collection', url: 'https://github.com/stars/MacManley/lists/esp32-esp8266-udp-telemetry', site: 'Github'},
            {label: 'GT7 UDP Plotly Visualiser', url: 'https://github.com/MacManley/gt7-track-visualizer', site: 'Github'},
            {label: 'GT7 Sport Mode Leaderboard Scraper', url: 'https://github.com/MacManley/gt7-leaderboards', site: 'Github'}
        ]
        // year: 2025
    },
    {
        id: 6,
        projectName: 'OnSite',
        technologyUsed: ['Swift'],
        role: '',
        blurb: 'A mobile app for managing site photos and information',
        status: 2, //wip
        links: [
            // {label: 'App Store Link', url: '', site: 'App'},
            // {label: 'Google Play Store Link', url: '', site: 'Play Store'}
        ]
        // year: 2025
    },
    {
        id: 7,
        projectName: 'VEX Robotics GCC',
        technologyUsed: ['C++'],
        role: 'Lead Programmer, Assistant Builder',
        blurb: 'Glanmire Community College 2023 Vex Robotics challenger',
        status: 0,
        links: [
            {label: 'GCC VEX Robotics Repository', url: '', site: 'Github'},
        ]
        // year: 2023
    }
    // {
    //     id: 100,
    //     projectName: 'LC Project 2025',
    //     technologyUsed: ['Javascript'],
    //     role: '',
    //     blurb: 'A device for recycling batteries',
    //     status: 0
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
  'Arduino': <SiArduino color="#00979D" />,
  'Blazor': <SiBlazor color="#512BD4" />,
  'React': <SiReact color="#61DAFB" />,
  'Vite': <SiVite color="#DFC5FE"/>,
  'Azure': <VscAzure color='#3CCBF4' />,
  'SQL': <TbSql />,
  'Swift': <SiSwift color="#FFAC45" />,
  'CSS': <SiCss3 color="#00599C"/>,
  'Fusion 360': <SiAutocad color="#ed742e"/>,
  '3D Printing': <TbBadge3D />, // approximate; no official 3D print icon
  'ESP8266': <FcElectronics /> , // no direct icon
  'Complete': <FcCheckmark />,
  'Ongoing': <FcRadarPlot />,
  'Work In Progress': <TbProgress />,
  'Github': <VscGithub />,
  'Youtube': <SiYoutube />,
  'LinkedIn': <SiLinkedin />,
  'App': <SiAppstore />,
  'Play Store': <SiGoogleplay />
};

export const statusMap = {
    0: 'Complete',
    1: 'Ongoing',
    2: 'Work In Progress',
  };

export const statusLabels = ['Complete', 'Ongoing', 'Work In Progress'];

export const statusColorMap = {
    0: "#2d5a2d",         // dark green
    1: "#2d4a5a",          // dark blue
    2: "#5a4a2d" // dark yellow/amber
  };