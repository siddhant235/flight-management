import { useState } from 'react'
import { PassengerForm } from '@/components/organisms/PassengerForm'
import type { Passenger } from '@/types/booking'
import { Button } from '@/components/molecules/Button'
import { ChevronDown } from 'lucide-react'

interface CollapsiblePassengerFormProps {
    index: number
    type: 'Adult' | 'Child' | 'Infant'
    data?: Omit<Passenger, 'id'>
    onSubmit: (data: Omit<Passenger, 'id'>, index: number) => void
    onDelete: (index: number) => void
    isLoading?: boolean
}

export function CollapsiblePassengerForm({
    index,
    type,
    data,
    onSubmit,
    onDelete,
    isLoading
}: CollapsiblePassengerFormProps) {
    const [isExpanded, setIsExpanded] = useState(!data)
    const [isEditing, setIsEditing] = useState(!data)

    const handleSubmit = (formData: Omit<Passenger, 'id'>) => {
        onSubmit(formData, index)
        setIsExpanded(false)
        setIsEditing(false)
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <div
                className={`p-4 cursor-pointer flex items-center justify-between ${data ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                    }`}
                onClick={() => !isEditing && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <ChevronDown
                        className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                    />
                    <div>
                        <h3 className="font-medium">
                            {type} Passenger {index + 1}
                        </h3>
                        {data && !isEditing && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {data.firstName} {data.lastName}
                            </p>
                        )}
                    </div>
                </div>
                {data && !isEditing && (
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsEditing(true)
                                setIsExpanded(true)
                            }}
                            variant="secondary"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(index)
                            }}
                            variant="danger"
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>
            {(isExpanded || isEditing) && (
                <div className="p-4 border-t dark:border-gray-700">
                    <PassengerForm
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        initialData={data}
                    />
                </div>
            )}
        </div>
    )
} 