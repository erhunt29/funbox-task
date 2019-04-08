import React from 'react';
import Sortable from 'react-sortablejs';
import uniqueId from 'lodash/uniqueId';

const PointsList = ({ referencePoints,order, onChange, removePoint }) => {
    const listItems = order.map( (position, i) => (
        <li key={uniqueId()} data-id={position} className='point'>
            <div className='point-text'>
               <b> Точка маршрута {i+1}:</b> <br/>
                {referencePoints[+position].name}<br/>
                {referencePoints[+position].description}
            </div>
            <button className='remove-point' onClick={removePoint(referencePoints[+position])}/>
        </li>
    ));

    return (
            <Sortable
                tag="ul"
                onChange={(order, sortable, evt) => {
                    const newReferencePoints = order.map(position => referencePoints[+position]);
                    onChange(newReferencePoints);
                }}
            >
                {listItems}
            </Sortable>
    );
};

export default PointsList;