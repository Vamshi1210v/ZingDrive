export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    KYCOnboarding: undefined;
    Onboarding: { step: number } | undefined;
    KYCUpload: undefined;
    VehicleSetup: undefined;
};

export type DriverTabParamList = {
    DriverHome: undefined;
    MyTrips: undefined;
    DriverProfile: undefined;
    MyVehicles: undefined;
};

export type AdminTabParamList = {
    AdminHome: undefined;
    ManageBookings: undefined;
    DriverList: undefined;
    AdminProfile: undefined;
};

export type RootStackParamList = {
    Auth: undefined;
    DriverApp: undefined;
    AdminApp: undefined;
    AddCar: undefined;
    KYCOnboarding: undefined;
    Loading: undefined;
};
