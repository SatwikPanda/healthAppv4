-- Drop all existing tables and types
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS prescription_items CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_schedules CASCADE;
DROP TABLE IF EXISTS doctor_leaves CASCADE;
DROP TABLE IF EXISTS doctor_working_hours CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS receptionists CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;
DROP TYPE IF EXISTS leave_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS leave_type CASCADE;
DROP TYPE IF EXISTS day_period CASCADE;
DROP TYPE IF EXISTS appointment_type CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('doctor', 'receptionist', 'patient');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE appointment_type AS ENUM ('consultation', 'follow_up', 'routine_checkup', 'emergency');

-- Users table (for authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    specialization TEXT NOT NULL DEFAULT 'General Physician',
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patients table (simplified)
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Doctor Working Hours
CREATE TABLE doctor_working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL DEFAULT '09:00:00',
    end_time TIME NOT NULL DEFAULT '17:00:00',
    is_working BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (doctor_id, day_of_week)
);

-- Doctor Leaves
CREATE TABLE doctor_leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    leave_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (doctor_id, leave_date)
);

-- Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_type appointment_type NOT NULL DEFAULT 'consultation',
    appointment_date TIMESTAMPTZ NOT NULL,
    status appointment_status NOT NULL DEFAULT 'pending',
    symptoms TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (doctor_id, appointment_date)
);

-- Create indexes for better query performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_doctor_patient ON appointments(doctor_id, patient_id);
CREATE INDEX idx_doctor_leaves_date ON doctor_leaves(leave_date);
CREATE INDEX idx_working_hours_doctor ON doctor_working_hours(doctor_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default doctor
INSERT INTO users (email, password_hash, role)
VALUES ('doctor@example.com', crypt('doctor123', gen_salt('bf')), 'doctor');

DO $$
DECLARE
    doctor_user_id UUID;
BEGIN
    SELECT id INTO doctor_user_id FROM users WHERE email = 'doctor@example.com';
    
    INSERT INTO doctors (user_id, first_name, last_name, specialization)
    VALUES (doctor_user_id, 'John', 'Smith', 'General Physician');
END $$;

-- Insert default working hours for the doctor
INSERT INTO doctor_working_hours (doctor_id, day_of_week, start_time, end_time, is_working)
SELECT 
    d.id,
    dow.day_of_week,
    '09:00:00'::TIME,
    '17:00:00'::TIME,
    CASE 
        WHEN dow.day_of_week IN (0, 6) THEN false  -- Weekend
        ELSE true                                   -- Weekday
    END
FROM doctors d
CROSS JOIN (
    SELECT generate_series(0, 6) AS day_of_week
) dow;

-- Create function to check doctor availability
CREATE OR REPLACE FUNCTION is_doctor_available(
    p_doctor_id UUID,
    p_date TIMESTAMPTZ
)
RETURNS BOOLEAN AS $$
DECLARE
    v_day_of_week INTEGER;
    v_time TIME;
    v_is_working BOOLEAN;
    v_is_on_leave BOOLEAN;
    v_has_appointment BOOLEAN;
BEGIN
    -- Get day of week (0-6, Sunday is 0)
    v_day_of_week := EXTRACT(DOW FROM p_date);
    v_time := p_date::TIME;

    -- Check working hours
    SELECT is_working INTO v_is_working
    FROM doctor_working_hours
    WHERE doctor_id = p_doctor_id
    AND day_of_week = v_day_of_week
    AND start_time <= v_time
    AND end_time > v_time;

    IF NOT FOUND OR NOT v_is_working THEN
        RETURN false;
    END IF;

    -- Check if on leave
    SELECT EXISTS (
        SELECT 1
        FROM doctor_leaves
        WHERE doctor_id = p_doctor_id
        AND leave_date = p_date::DATE
    ) INTO v_is_on_leave;

    IF v_is_on_leave THEN
        RETURN false;
    END IF;

    -- Check existing appointments
    SELECT EXISTS (
        SELECT 1
        FROM appointments
        WHERE doctor_id = p_doctor_id
        AND appointment_date = p_date
        AND status NOT IN ('cancelled')
    ) INTO v_has_appointment;

    RETURN NOT v_has_appointment;
END;
$$ LANGUAGE plpgsql;
