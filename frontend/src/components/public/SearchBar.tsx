import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search } from 'lucide-react';

export function SearchBar() {
    const navigate = useNavigate();

    // The Search Controller expects YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [city, setCity] = useState('');
    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState(tomorrow);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams();
        if (city.trim()) params.append('city', city.trim());
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);

        // Default 2 adults for a basic search
        params.append('adults', '2');

        navigate(`/search?${params.toString()}`);
    }

    return (
        <div className="search-bar-container">
            <form className="search-bar" onSubmit={handleSubmit}>

                {/* Destination */}
                <div className="search-bar__field">
                    <label className="search-bar__label">Where to?</label>
                    <div className="search-bar__input-wrap">
                        <MapPin size={18} className="search-bar__icon" />
                        <input
                            type="text"
                            placeholder="City, landmark, or hotel"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="search-bar__input"
                        />
                    </div>
                </div>

                <div className="search-bar__divider" />

                {/* Dates */}
                <div className="search-bar__field search-bar__field--date">
                    <label className="search-bar__label">Check-in</label>
                    <div className="search-bar__input-wrap">
                        <Calendar size={18} className="search-bar__icon" />
                        <input
                            type="date"
                            value={checkIn}
                            min={today}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="search-bar__input date-picker"
                        />
                    </div>
                </div>

                <div className="search-bar__field search-bar__field--date">
                    <label className="search-bar__label">Check-out</label>
                    <div className="search-bar__input-wrap">
                        <input
                            type="date"
                            value={checkOut}
                            min={checkIn || tomorrow}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="search-bar__input date-picker"
                        />
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" className="search-bar__submit">
                    <Search size={20} />
                    <span>Search</span>
                </button>
            </form>
        </div>
    );
}
