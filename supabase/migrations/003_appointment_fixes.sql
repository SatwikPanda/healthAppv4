-- Drop existing appointment-related tables
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_schedules CASCADE;
DROP TABLE IF EXISTS doctor_leaves CASCADE;

-- Recreate appointment status enum with more appropriate statuses
DROP TYPE IF EXISTS appointment_status CASCADE;
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create appointment types enum
CREATE TYPE appointment_type AS ENUM ('consultation', 'follow_up', 'routine_checkup', 'emergency');

-- Doctor Working Hours (simplified)
CREATE TABLE doctor_working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL DEFAULT '09:00:00',
    end_time TIME NOT NULL DEFAULT '17:00:00',
    is_working BOOLEAN DEFAULT true,
    UNIQUE (doctor_id, day_of_week)
);

-- Doctor Leaves (simplified)
CREATE TABLE doctor_leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    leave_date DATE NOT NULL,
    reason TEXT,
    UNIQUE (doctor_id, leave_date)
);

-- Appointments (simplified and improved)
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
    -- Ensure only one appointment per time slot per doctor
    UNIQUE (doctor_id, appointment_date)
);

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

-- Create indexes for better query performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_doctor_patient ON appointments(doctor_id, patient_id);
CREATE INDEX idx_doctor_leaves_date ON doctor_leaves(leave_date);
CREATE INDEX idx_working_hours_doctor ON doctor_working_hours(doctor_id);

-- Update trigger for appointments
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create functions for availability checking
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
        AND status != 'cancelled'
    ) INTO v_has_appointment;

    RETURN NOT v_has_appointment;
END;
$$ LANGUAGE plpgsql;
