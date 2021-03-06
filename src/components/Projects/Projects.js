import React, { Component } from 'react';
import './Projects.css';
import Project from './Project';

import roboImage from '../../images/robofriends.jpg';
import facefind from '../../images/facefind.jpg';
import matchbots from '../../images/Matchbots.jpg';
import crwn from '../../images/crwn.jpg';

import htmlIcon from '../../images/HTML5_Badge_512.png';
import cssIcon from '../../images/CSS3-Mark-Shape-Cut.png';
import jsIcon from '../../images/javascript-shield-logo.png';
import reactIcon from '../../images/react-hexagon.png';
import expressIcon from '../../images/expressjslogo.png';
import nodeIcon from '../../images/nodejs.png';
import scssIcon from '../../images/SCSS_logo.png';
import firebaseIcon from '../../images/firebase_logo.svg';

class Projects extends Component {
  render() {
    let i = 0;
    return (
      <div id='projects' className='project-grid'>
        <Project
          image={crwn}
          title={'CRWN Clothing - WIP'}
          description={
            'Front end ecommerce app handling user logins, carts and payments'
          }
          github={'https://github.com/sterlingwalsh/crwn-clothing'}
          site={'https://crwn-web.herokuapp.com/'}
          tech={[htmlIcon, scssIcon, jsIcon, reactIcon, firebaseIcon]}
          key={i++}
        />
        <Project
          image={roboImage}
          title={'RoboFriends'}
          description={
            'A simple page showing off the power of component based react development.'
          }
          github={'https://github.com/sterlingwalsh/robofriends'}
          site={'https://sterlingwalsh.github.io/robofriends/'}
          tech={[htmlIcon, cssIcon, jsIcon, reactIcon]}
          key={i++}
        />
        <Project
          image={facefind}
          title={'FaceFind'}
          description={
            'Full stack. Includes user authentication and activity tracking'
          }
          github={'https://github.com/sterlingwalsh/SmartBrain'}
          site={'https://facefind.herokuapp.com/'}
          tech={[htmlIcon, cssIcon, jsIcon, reactIcon, expressIcon, nodeIcon]}
          key={i++}
        />
        <Project
          image={matchbots}
          title={'MatchBots'}
          description={
            'Classic match game created with vanilla techs as part of a community challenge'
          }
          github={'https://github.com/sterlingwalsh/robofind'}
          site={'https://sterlingwalsh.github.io/robofind/'}
          tech={[htmlIcon, cssIcon, jsIcon]}
          key={i++}
        />
      </div>
    );
  }
}

export default Projects;
