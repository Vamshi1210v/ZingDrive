export const Colors = {
    primary: '#FF6B00',        // Vibrant Orange (Brand)
    secondary: '#1A1A1A',      // Deep Charcoal
    background: '#0F0F0F',     // True Black
    surface: '#1E1E1E',        // Dark Surface
    surfaceLight: '#2C2C2C',   // Lighter Surface for cards

    text: '#FFFFFF',           // Main Text
    textDim: '#A0A0A0',        // Subtitles
    textMuted: '#666666',      // Disabled/Muted text

    success: '#00C853',        // Verified Green
    error: '#FF3D00',          // Rejection Red
    warning: '#FFAB00',        // Pending Amber
    info: '#2979FF',           // Links/Info

    border: '#333333',
    divider: '#262626',

    overlay: 'rgba(0, 0, 0, 0.6)',
    glass: 'rgba(255, 255, 255, 0.08)',
    glassOutline: 'rgba(255, 255, 255, 0.12)',
    primaryGlass: 'rgba(255, 107, 0, 0.15)',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const Typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        color: Colors.text,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: Colors.text,
        letterSpacing: -0.4,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        color: Colors.text,
        letterSpacing: -0.2,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        color: Colors.text,
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        color: Colors.textDim,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: Colors.textMuted,
        textTransform: 'uppercase' as const,
        letterSpacing: 1,
    },
    button: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: Colors.text,
    },
};

export const Shadow = {
    small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
};
