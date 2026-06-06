import React, { Component } from 'react';
import ReactGA from 'react-ga4';

export class AboutNaif extends Component {

    constructor() {
        super();
        this.screens = {};
        this.state = {
            screen: () => { },
            active_screen: "about", // by default 'about' screen is active
            navbar: false,
        }
    }

    componentDidMount() {
        this.screens = {
            "about": <About />,
            "education": <Education />,
            "skills": <Skills />,
            "projects": <Projects />,
            "resume": <Resume />,
        }

        let lastVisitedScreen = localStorage.getItem("about-section");
        if (lastVisitedScreen === null || lastVisitedScreen === undefined) {
            lastVisitedScreen = "about";
        }

        // focus last visited screen
        this.changeScreen(document.getElementById(lastVisitedScreen));
    }

    changeScreen = (e) => {
        const screen = e.id || e.target.id;

        // store this state
        localStorage.setItem("about-section", screen);

        // google analytics
        ReactGA.send({ hitType: "pageview", page: `/${screen}`, title: "Custom Title" });


        this.setState({
            screen: this.screens[screen],
            active_screen: screen
        });
    }

    showNavBar = () => {
        this.setState({ navbar: !this.state.navbar });
    }

    renderNavLinks = () => {
        return (
            <>
                <div id="about" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "about" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="about naif" src="./themes/Yaru/status/about.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">About Me</span>
                </div>
                <div id="education" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "education" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="naif's education" src="./themes/Yaru/status/education.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Education</span>
                </div>
                <div id="skills" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "skills" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="naif's skills" src="./themes/Yaru/status/skills.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Skills</span>
                </div>
                <div id="projects" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "projects" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="naif's projects" src="./themes/Yaru/status/projects.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Projects</span>
                </div>
                <div id="resume" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "resume" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="naif's resume" src="./themes/Yaru/status/download.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Resume</span>
                </div>
            </>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex bg-ub-cool-grey text-white select-none relative">
                <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
                    {this.renderNavLinks()}
                </div>
                <div onClick={this.showNavBar} className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1">
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className=" w-3.5 border-t border-white" style={{ marginTop: "2pt", marginBottom: "2pt" }}></div>
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className={(this.state.navbar ? " visible animateShow z-30 " : " invisible ") + " md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20"}>
                        {this.renderNavLinks()}
                    </div>
                </div>
                <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen">
                    {this.state.screen}
                </div>
            </div>
        );
    }
}

export default AboutNaif;

export const displayAboutNaif = () => {
    return <AboutNaif />;
}


function About() {
    return (
        <>
            <div className="w-20 md:w-28 my-4 bg-white rounded-full">
                <img className="w-full" src="./images/logos/bitmoji.png" alt="Naif Naqeeb Logo" />
            </div>
            <div className=" mt-4 md:mt-8 text-lg md:text-2xl text-center px-1">
                <div>my name is <span className="font-bold">Naif Naqeeb</span> ,</div>
                <div className="font-normal ml-1">I'm a <span className="text-pink-600 font-bold">Full-Stack AI Engineer!</span></div>
            </div>
            <div className=" mt-4 relative md:my-8 pt-px bg-white w-32 md:w-48">
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-0"></div>
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-0"></div>
            </div>
            <ul className=" mt-4 leading-tight tracking-tight text-sm md:text-base w-5/6 md:w-3/4 emoji-list">
                <li className=" list-pc">In the vacuum of space, only well-designed systems survive — I build <span className=" font-medium">intelligent, scalable systems</span> with the same mindset. I'm an <span className="font-medium">Information Technology student at VIT</span> focused on building real-world applications at the intersection of Full Stack Development and Artificial Intelligence.</li>
                <li className=" mt-3 list-building">My work focuses on: <strong>Full Stack Development</strong>, <strong>LLM Applications & RAG Pipelines</strong>, <strong>Agentic AI</strong> (LangChain, LangGraph), and <strong>Cloud Systems</strong> (AWS, Docker).</li>
                <li className=" mt-3 list-star">I focus on building systems that are not just functional, but <strong>intelligent, scalable, and production-ready</strong>.</li>
                <li className=" mt-3 list-time">Beyond engineering, I'm deeply interested in <strong>football</strong> and <strong>space</strong> — two domains that reflect discipline, strategy, and systems thinking. Hit me up at <a className='text-underline' href='mailto:naifnaqeeb.123@gmail.com'><u>naifnaqeeb.123@gmail.com</u></a> :)</li>
            </ul>
        </>
    )
}

function Education() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Education
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className=" w-10/12  mt-4 ml-4 px-0 md:px-1">
                <li className="list-disc">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Vellore Institute of Technology
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">July 2023 – July 2027 &nbsp;·&nbsp; Vellore, India</div>
                    <div className=" text-sm md:text-base">B.Tech in Information Technology</div>
                    <div className="text-sm text-gray-300 font-bold mt-1">CGPA &nbsp; 8.85 / 10.0</div>
                </li>
                <li className="list-disc mt-5">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Burn Hall School
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2021 &nbsp;·&nbsp; Srinagar, India</div>
                    <div className=" text-sm md:text-base">Class 12<sup>th</sup> — Science (PCM)</div>
                    <div className="text-sm text-gray-300 font-bold mt-1">Percentage &nbsp; 95%</div>
                </li>
            </ul>
        </>
    )
}

function Skills() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Technical Skills
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className=" tracking-tight text-sm md:text-base w-10/12 emoji-list">
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    I've worked with a wide variety of programming languages & frameworks across full-stack and AI domains.
                </li>
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <div>My core expertise is in <strong className="text-ubt-gedit-orange">Full-Stack Development, LLM/RAG systems & Agentic AI!</strong></div>
                </li>
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <div>Here are my most frequently used</div>
                </li>
            </ul>
            <div className="w-full md:w-10/12 flex mt-4">
                <div className=" text-sm text-center md:text-base w-1/2 font-bold">Languages & Tools</div>
                <div className=" text-sm text-center md:text-base w-1/2 font-bold">Frameworks & Libraries</div>
            </div>
            <div className="w-full md:w-10/12 flex justify-center items-start font-bold text-center">
                <div className="px-2 w-1/2">
                    <div className="flex flex-wrap justify-center items-start w-full mt-2">
                        <img className="m-1" src="https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=flat&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23FFCE5A" alt="javascript" />
                        <img className="m-1" src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="typescript" />
                        <img className="m-1" src="http://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=ffffff" alt="python" />
                        <img className="m-1" src="https://img.shields.io/badge/C%2B%2B-00599C?style=flat&logo=c%2B%2B&logoColor=white" alt="c++" />
                        <img className="m-1" src="https://img.shields.io/badge/Java-ED8B00?style=flat&logo=java&logoColor=white" alt="java" />
                        <img className="m-1" src="https://img.shields.io/badge/SQL-4479A1?style=flat&logo=mysql&logoColor=white" alt="sql" />
                        <a href="https://www.google.com/search?q=is+html+a+language%3F" target={"_blank"} rel="noreferrer"><img title="yes it's a language!" className="m-1" src="https://img.shields.io/badge/-HTML5-%23E44D27?style=flat&logo=html5&logoColor=ffffff" alt="HTML" /></a>
                        <img src="https://img.shields.io/badge/-Git-%23F05032?style=flat&logo=git&logoColor=%23ffffff" alt="git" className="m-1" />
                        <img src="https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white" alt="aws" className="m-1" />
                        <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" alt="docker" className="m-1" />
                    </div>
                </div>
                <div className="px-2 flex flex-wrap items-start w-1/2">
                    <div className="flex flex-wrap justify-center items-start w-full mt-2">
                        <img className=" m-1" src="https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=ffffff" alt="next.js" />
                        <img className=" m-1" src="https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=ffffff" alt="react" />
                        <img className="m-1" src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="node.js" />
                        <img className="m-1" src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white" alt="fastapi" />
                        <img className="m-1" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="tailwindcss" />
                        <img className="m-1" src="https://img.shields.io/badge/LangChain-1C3C3C?style=flat&logo=langchain&logoColor=white" alt="langchain" />
                        <img className="m-1" src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white" alt="mongodb" />
                        <img className="m-1" src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white" alt="pytorch" />
                        <img className="m-1" src="https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikit-learn&logoColor=white" alt="scikit-learn" />
                    </div>
                </div>
            </div>
            <ul className=" tracking-tight text-sm md:text-base w-10/12 emoji-list mt-4">
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <span> And of course,</span> <img className=" inline ml-1" src="http://img.shields.io/badge/-Linux-0078D6?style=plastic&logo=linux&logoColor=ffffff" alt="linux" /> <span> !</span>
                </li>
            </ul>
        </>
    )
}

function Projects() {
    const project_list = [
        {
            name: "VitCare — AI Hospital Platform",
            date: "Feb – Apr 2026",
            link: "https://github.com/naifnaqeeb/VitCare",
            description: [
                "Full-stack MERN hospital platform with a multi-agent LangGraph AI system for symptom analysis, specialist recommendation, and end-to-end appointment booking.",
                "RAG-powered AI medical assistant via FastAPI, LangChain, Chroma vector store & Groq LLM (Llama 3) with session-isolated conversation history.",
            ],
            domains: ["react.js", "fastapi", "langchain", "langgraph", "chromadb", "groq", "tailwindcss", "jwt"]
        },
        {
            name: "Campus-Care — Grievance System",
            date: "Nov 2025 – Jan 2026",
            link: "https://github.com/naifnaqeeb/Campus-Care",
            description: [
                "Full-stack grievance management system with Role-Based Access Control (RBAC) and real-time dashboards, deployed on AWS EC2 with Cognito auth.",
                "Amazon S3 for media storage and DynamoDB for high-availability persistence with sub-100ms retrieval.",
            ],
            domains: ["next.js", "aws", "dynamodb", "cognito", "typescript"]
        },
        {
            name: "RAG-based AI Teaching Assistant",
            date: "2025",
            link: "https://github.com/naifnaqeeb/RAG-based-AI-Teaching-Assistant",
            description: [
                "Playlist-aware RAG system with Whisper-based transcription and timestamp-grounded LLM responses for YouTube lectures.",
            ],
            domains: ["python", "langchain", "fastapi", "whisper", "chromadb"]
        },
        {
            name: "Scheduler AI",
            date: "2025",
            link: "https://github.com/naifnaqeeb/Scheduler-AI",
            description: [
                "AI-powered scheduling assistant built with agentic AI principles.",
            ],
            domains: ["python", "langchain", "fastapi"]
        },
    ];

    const tag_colors = {
        "javascript": "yellow-300",
        "python": "green-200",
        "typescript": "blue-400",
        "react.js": "cyan-400",
        "next.js": "purple-600",
        "node.js": "green-500",
        "fastapi": "teal-400",
        "langchain": "green-400",
        "langgraph": "emerald-500",
        "mongodb": "green-600",
        "tailwindcss": "blue-300",
        "aws": "yellow-500",
        "docker": "blue-500",
        "whisper": "gray-400",
        "firebase": "red-600",
        "chromadb": "purple-400",
        "groq": "orange-400",
        "dynamodb": "yellow-600",
        "cognito": "blue-600",
        "jwt": "pink-400",
    }

    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Projects
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <p className="text-gray-400 text-sm my-2 px-4">A selection of projects I've built — more on <a href="https://github.com/naifnaqeeb" target="_blank" rel="noreferrer" className="text-blue-400 underline">GitHub</a>.</p>

            {
                project_list.map((project, index) => {
                    const projectNameFromLink = project.link.split('/')
                    const projectName = projectNameFromLink[projectNameFromLink.length - 1]
                    return (
                        <a key={index} href={project.link} target="_blank" rel="noreferrer" className="flex w-full flex-col px-4">
                            <div className="w-full py-1 px-2 my-2 border border-gray-50 border-opacity-10 rounded hover:bg-gray-50 hover:bg-opacity-5 cursor-pointer">
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className='flex justify-center items-center'>
                                        <div className=" text-base md:text-lg mr-2">{project.name.toLowerCase()}</div>
                                        <iframe src={`https://ghbtns.com/github-btn.html?user=naifnaqeeb&repo=${projectName}&type=star&count=true`} frameBorder="0" scrolling="0" width="150" height="20" title={project.name.toLowerCase() + "-star"}></iframe>
                                    </div>
                                    <div className="text-gray-300 font-light text-sm">{project.date}</div>
                                </div>
                                <ul className=" tracking-normal leading-tight text-sm font-light ml-4 mt-1">
                                    {
                                        project.description.map((desc, index) => {
                                            return <li key={index} className="list-disc mt-1 text-gray-100">{desc}</li>;
                                        })
                                    }
                                </ul>
                                <div className="flex flex-wrap items-start justify-start text-xs py-2">
                                    {
                                        (project.domains ?
                                            project.domains.map((domain, index) => {
                                                return <span key={index} className={`px-1.5 py-0.5 w-max border border-${tag_colors[domain] || 'gray-400'} text-${tag_colors[domain] || 'gray-400'} m-1 rounded-full`}>{domain}</span>
                                            })

                                            : null)
                                    }
                                </div>
                            </div>
                        </a>
                    )
                })
            }
        </>
    )
}

function Resume() {
    return (
        <iframe className="h-full w-full" src="./files/Naif-Naqeeb-Resume.pdf" title="naif naqeeb resume" frameBorder="0"></iframe>
    )
}