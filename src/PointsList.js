import React from 'react';
import Sortable from 'react-sortablejs';
import uniqueId from 'lodash/uniqueId';

// Functional Component
const PointsList = ({ referencePoints,order, onChange, removePoint }) => {
    // let sortable = null; // sortable instance
    // const reverseOrder = (evt) => {
    //     const order = sortable.toArray();
    //     onChange(order.reverse());
    // };
    //console.log(order)
    const listItems = order.map( (position, i) => (
        <li key={uniqueId()} data-id={position} className='point'>
            <div>
                Точка маршрута {i+1}: <br/>
                {referencePoints[+position].name + ' ' + referencePoints[+position].description}
            </div>
            <button className='remove-point' onClick={removePoint(referencePoints[+position])}/>
        </li>
    ));

    return (
        <div>
            {/*<button type="button" onClick={reverseOrder}>Reverse Order</button>*/}
            <Sortable
                // Sortable options (https://github.com/RubaXa/Sortable#options)
                options={{
                }}

                // [Optional] Use ref to get the sortable instance
                // https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute
                // ref={(c) => {
                //     if (c) {
                //         sortable = c.sortable;
                //     }
                // }}

                // [Optional] A tag or react component to specify the wrapping element. Defaults to "div".
                // In a case of a react component it is required to has children in the component
                // and pass it down.
                tag="ul"

                // [Optional] The onChange method allows you to implement a controlled component and keep
                // DOM nodes untouched. You have to change state to re-render the component.
                // @param {Array} order An ordered array of items defined by the `data-id` attribute.
                // @param {Object} sortable The sortable instance.
                // @param {Event} evt The event object.
                onChange={(order, sortable, evt) => {
                    const newReferencePoints = order.map(position => referencePoints[+position]);
                    onChange(newReferencePoints, order);
                }}
            >
                {listItems}
            </Sortable>
        </div>
    );
};

export default PointsList;