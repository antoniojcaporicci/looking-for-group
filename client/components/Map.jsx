import React from 'react';
import ReactDOM from 'react-dom';
import Container from './MapContainer.jsx';
import Nav from './Nav.jsx';

export default class Map extends React.Component {
    renderChildren() {
        const { children } = this.props;
        if (!children) return;
        if (!this.props.google) return;
        let result = React.Children.map(children, c => {
            return React.cloneElement(c, {
                map: this.map,
                google: this.props.google,
                mapCenter: this.state.currentLocation
            });
        })
        console.log(result)
        return result
    }

    constructor(props) {
        super(props);

        const {lat, lng} = this.props.initialCenter;
        this.state = {
            currentLocation: {
                lat: lat,
                lng: lng
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
            this.recenterMap();
        }
    }

    recenterMap() {
        const map = this.map;
        const curr = this.state.currentLocation;

        const google = this.props.google;
        const maps = google.maps;

        if (map) {
            let center = new maps.LatLng(curr.lat, curr.lng)
            map.PanTo(center)
        }
    }

    componentDidMount() {
        if (this.props.centerAroundCurrentLocation) {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const coords = pos.coords;
                    this.setState({
                        currentLocation: {
                            lat: coords.latitude,
                            lng: coords.longitude
                        }
                    })
                })
            }
        }
        this.loadMap();
    }

    loadMap() {
        if (this.props && this.props.google) {
            // google is available
            const {google} = this.props;
            const maps = google.maps;

            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);

            let {initialCenter, zoom} = this.props;
            const {lat, lng} = this.state.currentLocation;
            const center = new maps.LatLng(lat, lng);
            const mapConfig = Object.assign({}, {
                center: center,
                zoom: zoom
            })
            this.map = new maps.Map(node, mapConfig);

                       evtNames.forEach(e => {
                this.map.addListener(e, this.handleEvent(e));
            });

            maps.event.trigger(this.map, 'ready');

            /* let centerChangedTimeout;
             * this.map.addListener('dragend', (evt) => {
             *     if (centerChangedTimeout) {
             *         clearTimeout(centerChangedTimeout);
             *         centerChangedTimeout = null;
             *     }
             *     centerChangedTimeout = setTimeout(() => {
             *         this.props.onMove(this.map);
             *     }, 0);
             * })*/
        }
    }

    handleEvent(evtName) {
        let timeout;
        const handlerName = `on${camelize(evtName)}`;
        return (e) => {
            if(timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            timeout = setTimeout(() => {
                if (this.props[handlerName]) {
                    this.props[handlerName](this.props, this.map, e);
                }
            }, 0);
        }
    }

    render () {
        return (
            <div>
            <Nav />
            <div ref='map'
            style={{height: '100vh', width: '100vw'}}>
                Loading map...
                {this.renderChildren()}
            </div>
            </div>
        )
    }
}

const evtNames = ['click', 'dragend', 'ready'];

Map.propTypes = {
    google: React.PropTypes.object,
    zoom: React.PropTypes.number,
    initialCenter: React.PropTypes.object,
    centerAroundCurrentLocation: React.PropTypes.bool,
    onMove: React.PropTypes.func,
    /* evtNames.forEach(e => Map.propTypes[camelize(e)] = T.func)*/
 }

Map.defaultProps = {
    zoom: 13,
    // Austin, by default
    initialCenter: {
        lat: 30.2672,
        lng: -97.7431
    },
    centerAroundCurrentLocation: false,
    onMove: function() {} // default prop
}

const camelize = function(str) {
    return str.split(' ').map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
}
