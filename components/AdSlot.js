import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function AdSlot({
                                   client,
                                   slot,
                                   format = 'auto',
                                   className = '',
                                   style = {},
                               }) {
    const adRef = useRef(null);

    useEffect(() => {
        if (!window.adsbygoogle || !adRef.current) return;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense initialization error:', e, {
                client,
                slot,
                format,
            });
        }
    }, [client, slot, format]);

    return (
        <ins
            ref={adRef}
            className={`adsbygoogle ${className}`}
            style={{ display: 'block', ...style }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
            aria-label="Advertisement"
        ></ins>
    );
}

AdSlot.propTypes = {
    client: PropTypes.string.isRequired,
    slot: PropTypes.string.isRequired,
    format: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
};
