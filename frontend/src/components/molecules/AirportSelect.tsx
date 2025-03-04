import { useEffect, useState, useRef } from 'react'
import { Input } from '@/components/atoms/FormElements'
import type { Airport } from '@/app/api/airports/route'

interface AirportSelectProps {
    label: string
    value: string
    onChange: (value: string) => void
    excludeAirport?: string
    error?: string
}

export function AirportSelect({ label, value, onChange, excludeAirport, error }: AirportSelectProps) {
    const [airports, setAirports] = useState<Airport[]>([])
    const [filteredAirports, setFilteredAirports] = useState<Airport[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await fetch('/api/airports')
                const data = await response.json()
                setAirports(data)
            } catch (error) {
                console.error('Failed to fetch airports:', error)
            }
        }

        fetchAirports()
    }, [])

    useEffect(() => {
        // Find the selected airport and set the input value
        if (value) {
            const selectedAirport = airports.find(a => a.airport_code === value)
            if (selectedAirport) {
                setInputValue(`${selectedAirport.city} (${selectedAirport.airport_code})`)
            }
        }
    }, [value, airports])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase()
        setInputValue(query)
        setIsOpen(true)

        const filtered = airports
            .filter(airport => {
                if (excludeAirport && airport.airport_code === excludeAirport) {
                    return false
                }
                return (
                    airport.city.toLowerCase().includes(query) ||
                    airport.airport_code.toLowerCase().includes(query) ||
                    airport.airport_name.toLowerCase().includes(query)
                )
            })
            .slice(0, 5)

        setFilteredAirports(filtered)
    }

    const handleSelectAirport = (airport: Airport) => {
        onChange(airport.airport_code)
        setInputValue(`${airport.city} (${airport.airport_code})`)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <Input
                label={label}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                error={error}
                placeholder="Search by city or airport code"
            />
            {isOpen && filteredAirports.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                    {filteredAirports.map((airport) => (
                        <button
                            key={airport.airport_code}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                            onClick={() => handleSelectAirport(airport)}
                            type="button"
                        >
                            <div className="text-gray-900 dark:text-white">
                                {airport.city} ({airport.airport_code})
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {airport.airport_name}, {airport.country}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
