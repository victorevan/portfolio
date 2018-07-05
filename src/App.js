import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'; 
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './css/App.css';
import './css/victor.css';

import Header from './components/Header';
import Intro from './components/Intro';
import Portfolio from './components/Portfolio';
import CaseStudy from './components/CaseStudy';
import About from './components/About';

class App extends Component {

  state = {
    pageIsAnimating: false,
    animateFromPage: null,
  }

  componentDidMount = () => {
    // sets the initial animateFromPage location on app load
    this.setState({animateFromPage: this.props.location.pathname});
    // scroll event listener
    window.addEventListener('wheel',this.changeOnScroll);
  }

  changeOnScroll = e => {
    const detectScrollDirection = e => {
      let delta = e.wheelDelta ? e.wheelDelta : -1 * e.deltaY;
      // Negative delta is scroll down, positive delta is scroll up
      return delta < 0 ? 'scrollDown' : 'scrollUp';
    }
    
    if (!this.state.pageIsAnimating) {
      if (detectScrollDirection(e) === 'scrollDown' && 
        this.props.location.pathname === '/'
      ) {
        this.props.history.push('/portfolio');
        this.setState({pageIsAnimating: true});
      }
      if (
        detectScrollDirection(e) === 'scrollUp' &&
        this.props.location.pathname === '/portfolio' &&
        window.pageYOffset === 0 // 0 pageYOffset is top of page
      ) {
        this.props.history.push('/');
        this.setState({pageIsAnimating: true});
      }
    }
  }

  render() {
    const childFactoryCreator = () => {
      let classNames = {
        enter: '',
        enterActive: '',
        enterDone: '',
        exit: '',
        exitActive: '',
        exitDone: '',
      };
      let timeout = 0, appear = false;
      let animateFromPage = this.state.animateFromPage;
      let animateToPage = this.props.location.pathname;
      if (animateFromPage === '/' && animateToPage === '/portfolio') {
        classNames = {
          enter: 'slide-up-from-bottom',
          enterActive: 'slide-up-from-bottom-active',
          enterDone: '',
          exit: 'slide-up-from-middle',
          exitActive: 'slide-up-from-middle-active',
          exitDone: 'slide-up-from-middle-done',
        };
        timeout = 1500;
      } else if (animateFromPage === '/portfolio' && animateToPage === '/') {
        classNames = {
          enter: 'slide-down-from-top',
          enterActive: 'slide-down-from-top-active',
          enterDone: '',
          exit: 'slide-down-from-middle',
          exitActive: 'slide-down-from-middle-active',
          exitDone: 'slide-down-from-middle-done',
        };
        timeout = 1500;
      } else if (animateToPage === '/portfolio/tic-tac-toe') {
        classNames = 'fade';
        timeout = 500;
      } else if (animateFromPage === '/portfolio/tic-tac-toe' && animateToPage === '/portfolio') {
        classNames = 'fade';
        timeout = 500;
      } else if (animateFromPage === '/portfolio/tic-tac-toe' && animateToPage === '/') {
        classNames = 'fade';
        timeout = 500;
      } else if (animateToPage === '/contact') {
        timeout = 2000;
      }
        return (
        (child) => {
          return ( React.cloneElement(child, { classNames, timeout, appear }) )
        }
      );
    }

    return (
      <div className='app'>
        <Header 
          location={this.props.location}
          isAnimating={this.state.pageIsAnimating}
        />
        <TransitionGroup 
          component={null}
          childFactory={childFactoryCreator()}
        >
          <CSSTransition 
            key={this.props.location.pathname}
            timeout={0}
            onEnter={() => {
              // console.log(`onEnter: A <Transition> callback fired immediately after the 'enter' or 'appear' class is applied.`);
              document.body.style.overflow = "hidden";
              this.setState({pageIsAnimating: true});
            }}
            // onEntering={() => console.log(`onEntering: A <Transition> callback fired immediately after the 'enter-active' or 'appear-active' class is applied.`)}
            onEntered={() => {
              // console.log(`onEntered: A <Transition> callback fired immediately after the 'enter' or 'appear' classes are removed and the done class is added to the DOM node.`);
              if (this.props.location.pathname === '/') this.setState({pageIsAnimating: false});
            }}
            // onExit={() => console.log(`onExit: A <Transition> callback fired immediately after the 'exit' class is applied.`)}
            // onExiting={() => console.log(`onExiting: A <Transition> callback fired immediately after the 'exit-active' is applied.`)}
            onExited={() => {
              // console.log(`onExited: A <Transition> callback fired immediately after the 'exit' classes are removed and the exit-done class is added to the DOM node.`);
              // set the current Page to be the animateFromPage going forward
              setTimeout( () => {
                this.setState({animateFromPage: this.props.location.pathname, pageIsAnimating: false});
              },0 );
              document.body.style.overflow = "auto";
            }}
          >
            <Switch location={this.props.location}>
              <Route exact path={`/`} render={props => 
                <Intro 
                  {...props} 
                  isAnimating={this.state.pageIsAnimating}
                />} 
              />
              <Route exact path={`/portfolio`} render={props =>
                <Portfolio 
                  {...props}
                  projects={this.props.projects}
                />} 
              />
              <Route exact path={`/contact`} render={props =>
                <About
                  {...props}
                />} 
              />
              {this.props.projects.map( project => (
                <Route key={project.title} exact path={`/portfolio/${project.title}`} render={props =>
                  <CaseStudy
                    {...props}
                    project={project}
                  />}
                />
              ))}
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    );
  }
}

App.defaultProps = {
  projects: [
    {
      title: 'tic-tac-toe',
      description: 'Redux Game',
      noteworthySkills: [
        {
          skill: 'React Lifecycle Methods',
          purpose: 'componentDidUpdate proved useful for dynamically initiating player turns on state change.'
        },
        {
          skill: 'Redux',
          purpose: 'Single source of truth for application state, including player and AI moves. Connected to Container Components'
        },
        {
          skill: 'Sass',
          purpose: 'Used preprocessor to create cleaner and more maintainable styles'
        }
      ]
    },
    {
      title: 'calculator',
      description: 'Functional & responsive',
      noteworthySkills: [
        {
          skill: 'Dynamically Rendered React Components',
          purpose: 'Calculator buttons are dynamically rendered from JavaScript data structures'
        },
        {
          skill: 'CSS Grid',
          purpose: 'Layout System used to create calculator button rows and columns'
        },
        {
          skill: 'React CSS Transitions Group',
          purpose: 'High-level API add-on used to perform simple and reusable CSS animations'
        }
      ]
    },
    {
      title: 'random-quote-machine',
      description: 'Beautiful & inspirational',
      noteworthySkills: [
        {
          skill: 'Fetch API',
          purpose: 'Used to request JSON containing quote data from remote server API'
        },
        {
          skill: 'CSS Media Query Responsive Design',
          purpose: 'Images and layout are dynamic according to device dimensions'
        },
        {
          skill: 'Regex',
          purpose: 'Quotes and Author names are adjusted for Twitter Query with Replace method'
        }
      ]
    },
    {
      title: 'pomodoro-clock',
      description: 'Simple productivity app',
      noteworthySkills: [
        {
          skill: '',
          purpose: ''
        },
        {
          skill: '',
          purpose: ''
        },
        {
          skill: '',
          purpose: ''
        }
      ]
    }
  ]
};

export default App;