export type UserRole = 'admin' | 'driver';

export type VerificationStatus = 'new' | 'pending' | 'verified' | 'rejected';

export interface Profile {
    id: string;
    role: UserRole;
    full_name: string | null;
    phone: string | null;
    dob: string | null;
    gender: string | null;
    rating: number;
    is_verified: boolean;
    verification_status: VerificationStatus;
    rejection_reason: string | null;
    created_at: string;
}

export type VehicleType = 'SUV' | 'Sedan' | 'Hatchback' | 'Mini Bus' | 'Bus' | 'Heavy';

export interface Vehicle {
    id: string;
    driver_id: string;
    vehicle_type: VehicleType;
    seats: number;
    model_no: string;
    rc_number: string;
    rc_image_url: string;
    vehicle_image_url: string;
    pet_allowed: boolean;
    fuel_type: string;
    status: VerificationStatus;
    is_active: boolean;
    created_at: string;
}

export interface Subscription {
    id: string;
    driver_id: string;
    total_credits: number;
    remaining_credits: number;
    start_date: string;
    end_date: string;
    status: 'active' | 'inactive' | 'expired';
}

export type BookingStatus = 'open' | 'accepted' | 'started' | 'completed' | 'cancelled';

export interface Booking {
    id: string;
    pickup_address: string;
    drop_address: string;
    pickup_lat: number | null;
    pickup_lng: number | null;
    drop_lat: number | null;
    drop_lng: number | null;
    vehicle_type_required: VehicleType;
    seats_required: number;
    fare_estimate: number;
    customer_name: string;
    customer_phone: string;
    assigned_driver_id: string | null;
    assigned_vehicle_id: string | null;
    accepted_at: string | null;
    status: BookingStatus;
    notification_sent: boolean;
    created_at: string;
}
