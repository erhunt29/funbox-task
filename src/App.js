import React, { Component } from 'react';
import './App.css';
import PointsList from "./PointsList";
class App extends Component {
    state = {
        referencePoints: [],
        order: [],
        inputAddress: '',
        routeIsCreated: false,
    };

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
    };

    handleLoad = () => {
        window.ymaps.ready(() => {
            this.localMap = new window.ymaps.Map('map', {center: [55.734876, 37.59308], zoom: 10,},);

        });


    };

    handleInput = (ev) => {
        this.setState({
            inputAddress : ev.target.value
        })
    };

    createRoute = () => {
        const {inputAddress} = this.state;
        this.multiRoute = new window.ymaps.multiRouter.MultiRoute({
                referencePoints: [inputAddress]
                ,
                params: {
                    routingMode: 'auto',
                    reverseGeocoding: true
                }
            }
            ,{
                boundsAutoApply: true,
                balloonLayout: this.balloonLayout,
            });

        this.multiRoute.editor.start();

        this.multiRoute.model.events.add('requestsuccess', () => {  // Срабатывает при изменении марщрута

            this.multiRoute.getWayPoints().each((point, key)=>{
                console.log(point.properties._data);
                // console.log(point.properties._data.address);
                //debugger
                window.ymaps.geoObject.addon.balloon.get(point);
                point.properties.set({
                    balloonContent:`Точка маршрута ${point.properties._data.index+1}`,
                });
            });


            this.multiRoute.events.add("boundschange", () => {

              const {referencePoints} = this.state;

               if(referencePoints.length!== 0) {
                   this.localMap.setBounds( this.multiRoute.getBounds(), {
                       checkZoomRange: true
                   });
               }
            });

            const newReferencePoints =  this.multiRoute.model.properties._data.waypoints;


            let  newOrder = newReferencePoints.map((point, i) => i);
            this.setState({referencePoints: newReferencePoints, order: newOrder, routeIsCreated: true})

        });

        this.localMap.geoObjects.add(this.multiRoute);
    };

    addPoint = (ev) => {
        ev.preventDefault();
        const {routeIsCreated, inputAddress, referencePoints} = this.state;

        if (!routeIsCreated) {
          this.createRoute();
        }

        else {
          const coordinatesOfReferencePoints = referencePoints.map( point => point.coordinates.reverse());
          coordinatesOfReferencePoints.push(inputAddress);
          this.multiRoute.model.setReferencePoints(coordinatesOfReferencePoints)
        }

        this.setState({inputAddress: '',})
    };

    removePoint = deletePoint => () => {
        const {referencePoints} = this.state;
        const newReferencePoints =  referencePoints.filter(point => point.coordinates!== deletePoint.coordinates);
        const newOrder = newReferencePoints.map( (point, i) => i);
        this.setState({referencePoints: newReferencePoints, order: newOrder}, this.updateRoute)
    }

    updateRoute = () => {
        const {referencePoints} = this.state;
        const coordinatesOfReferencePoints = referencePoints.map( point => point.coordinates.reverse());
        this.multiRoute.model.setReferencePoints(coordinatesOfReferencePoints)
    };

    render() {
        const {referencePoints, inputAddress, order} = this.state;
        console.log(order);
        console.log(referencePoints);
        return (
          <div className='app-container'>
              <div>
                  <form className='app-form'>
                      <input
                          className='form-input'
                          type="text"
                          autoFocus
                          placeholder='Новая точка маршрута'
                          onChange={this.handleInput}
                          value={inputAddress}
                      />
                      <button className='form-button'  onClick={this.addPoint}>Добавить</button>
                  </form>
                  <PointsList
                      removePoint={this.removePoint}
                      order={order}
                      referencePoints={referencePoints}
                      onChange={(referencePoints, order) => {
                          this.setState({ referencePoints, order }, this.updateRoute);
                      }}
                  >
                  </PointsList>
              </div>
              <div id='map' className='map'>
              </div>
          </div>
        );
  }
}

export default App;
