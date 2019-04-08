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
            this.localMap = new window.ymaps.Map('map', {center: [55.734876, 37.59308], zoom: 10,},);  // Созлаем карту
        });
    };

    handleInput = (ev) => {
        this.setState({
            inputAddress : ev.target.value
        })
    };

    handleRouteUpdate = () => { // Срабатывает при создании и изменении маршрута
        this.multiRoute.getWayPoints().each((point, key)=>{  // На каждую точку добавляем балун
            window.ymaps.geoObject.addon.balloon.get(point);
            point.properties.set({
                balloonContent:`Точка маршрута ${point.properties._data.index + 1}`,
            });
        });

        this.multiRoute.events.add("boundschange", this.handleBoundsChange);

        const newReferencePoints =  this.multiRoute.model.properties._data.waypoints; // Получаем точки маршрута ввиде массива

        const  newOrder = newReferencePoints.map((point, i) => i);
        this.setState({referencePoints: newReferencePoints, order: newOrder, routeIsCreated: true})
    };

    handleBoundsChange = () => {  // Автоматически устанавливает границы карты так, чтобы маршрут был виден целиком
        const {referencePoints} = this.state;

        if(referencePoints.length!== 0) {
            this.localMap.setBounds( this.multiRoute.getBounds(), {
                checkZoomRange: true
            });
        }
    };

    createRoute = () => {
        const {inputAddress} = this.state;
        this.multiRoute = new window.ymaps.multiRouter.MultiRoute({  // Создаем мультимаршрут
                referencePoints: [inputAddress],
                params: {
                    routingMode: 'auto',   // Выбор способа передвижения
                    reverseGeocoding: true // Позволяет задать новую точку координатами
                }
            }
            ,{
                boundsAutoApply: true,
            });

        this.multiRoute.editor.start(); // Включаем режим редактрирования для возможности перетаскивания точек

        this.multiRoute.model.events.add('requestsuccess', this.handleRouteUpdate);

        this.localMap.geoObjects.add(this.multiRoute); // Добавляем маршрут на карту
    };

    addPoint = (ev) => {
        ev.preventDefault();
        const {routeIsCreated, inputAddress, referencePoints} = this.state;

        if (!routeIsCreated) {
          this.createRoute();
        }

        else {
          const coordinatesOfReferencePoints = referencePoints.map( point => point.coordinates.reverse()); // Меняем порядок координат, т.к. вводимые и получаемые координаты не совпадают
          coordinatesOfReferencePoints.push(inputAddress);
          this.multiRoute.model.setReferencePoints(coordinatesOfReferencePoints) // Обновляем маршрут
        }

        this.setState({inputAddress: '',})
    };

    removePoint = deletePoint => () => {
        const {referencePoints} = this.state;
        const newReferencePoints =  referencePoints.filter(point => point.coordinates!== deletePoint.coordinates); // Проверка по координатам
        const newOrder = newReferencePoints.map( (point, i) => i);
        this.setState({referencePoints: newReferencePoints, order: newOrder}, this.updateRoute)
    };

    updateRoute = (referencePoints = this.state.referencePoints) => {
        const coordinatesOfReferencePoints = referencePoints.map( point => point.coordinates.reverse()); // Меняем порядок координат, т.к. вводимые и получаемые координаты не совпадают
        this.multiRoute.model.setReferencePoints(coordinatesOfReferencePoints)
    };

    render() {
        const {referencePoints, inputAddress, order} = this.state;

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
                      onChange={(referencePoints) => {
                          this.updateRoute(referencePoints);
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
