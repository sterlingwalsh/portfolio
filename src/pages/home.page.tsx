import { Button } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from '../helpers/utils';

const navItems = [
    ['#', 'Home'],
    ['#about', 'About'],
    ['#snippets', 'Snippets'],
    ['#contact', 'Contact'],
];

export const Home: React.FC = () => {
    const { hash } = useLocation();
    return (
        <div className='home-page'>
            <div className='home-page__content'>
                <header>
                    <h2>Sterling Walsh</h2>
                    <h3>Front End Developer</h3>
                </header>
                <main>
                    <aside>
                        <div>
                            <h4>Professional Summary</h4>
                            <div>
                                <p>Results driven software engineer with two years industry experience bringing custom solutions from idea to the web.</p>
                                <p>I'm a self-taught developer working primarily in React with Typescript and proven ability in creating performant and polished applications.</p>
                            </div>
                        </div>
                        <div>
                            <h4>Core Strengths</h4>
                            <div>
                                <ul>
                                    <li>Fast Learning</li>
                                    <li>Strong problem solver</li>
                                    <li>Superb attention to detail</li>
                                    <li>Great communication skills</li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h4>Stack</h4>
                            <div>
                                <ul>
                                    <li>React, Javascript/Typescript</li>
                                    <li>Jest</li>
                                    <li>NodeJS, Express, Postgres</li>
                                    <li>NPM, Git</li>
                                    <li>Readiness to learn the next thing</li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                    <section>
                        <h4>Highlighted Projects</h4>
                        <article>
                            <img src={process.env.PUBLIC_URL + '/images/RA-map.jpg'} alt='risk architecture map' />
                            <div>
                                <h5>Risk Architecture</h5>
                                <ul>
                                    <li>React/Typescript, Regraph, Esri, TDD</li>
                                    <li>Design and develop reusable components with flexible functionality</li>
                                    <li>Work with other developers to design performant logic for handling large data sets</li>
                                </ul>
                            </div>
                        </article>
                        <article>
                            <img src={process.env.PUBLIC_URL + '/images/sti-table.jpg'} alt='shipment trackers table' />
                            <div>
                                <h5>Shipment Trackers</h5>
                                <ul>
                                    <li>React/Typescript, Material UI, Websockets</li>
                                    <li>Granular user permissions controls</li>
                                </ul>
                            </div>
                        </article>
                        <article>
                            <img src={process.env.PUBLIC_URL + '/images/plw-map.jpg'} alt='p l weaver map' />
                            <div>
                                <h5>Agri-Logistics</h5>
                                <ul>
                                    <li>React/Typescript, Mapbox, Material UI, Websockets</li>
                                    <li>Scheduling and logistics for milk pickup/delivery</li>
                                </ul>
                            </div>
                        </article>
                    </section>
                </main>
            </div>
        </div>
    );
};
