drop database campus_parking;

create database if not exists campus_parking;

use campus_parking;

CREATE TABLE department (department_name varchar(100) PRIMARY KEY);

INSERT INTO department VALUES ('CSE');
INSERT INTO department VALUES ('ECE');
INSERT INTO department VALUES ('AI/ML');
INSERT INTO department VALUES ('BBA');
INSERT INTO department VALUES ('Nursing');

select * from department;

CREATE TABLE student (
	SRN varchar(15), 
    first_name varchar(50), 
    last_name varchar(50), 
    semester int, 
    section varchar(2), 
    department_name varchar(100), 
	PRIMARY KEY(SRN), 
    FOREIGN KEY (department_name) 
    REFERENCES department(department_name));

SELECT * FROM student;

CREATE TABLE roles (role varchar(100) PRIMARY KEY);

CREATE TABLE staff (
	ID varchar(15), 
    first_name varchar(50), 
    last_name varchar(50), 
    department_name varchar(100), 
    PRIMARY KEY(ID), 
    FOREIGN KEY(department_name) REFERENCES department(department_name));

SELECT * FROM staff;

CREATE TABLE admin (
	ID varchar(15), 
    first_name varchar(50), 
    last_name varchar(50), 
    PRIMARY KEY(ID));

CREATE TABLE users (
	ID varchar(15), 
	password varchar(100), 
    email varchar(100), 
    role varchar(100), 
    first_name varchar(50), 
    last_name varchar(50), 
    PRIMARY KEY(ID), 
    FOREIGN KEY(role) REFERENCES roles(role));

SELECT * FROM users;

 drop table parking;

select * from parking;

CREATE TABLE parking (
  parking_spot_id INT AUTO_INCREMENT,
  rowNo CHAR(1) NOT NULL,
  spot_number VARCHAR(3) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  reserved_by VARCHAR(15) DEFAULT NULL,
  -- for_role VARCHAR(100),
  PRIMARY KEY (parking_spot_id),
  UNIQUE (rowNo, spot_number)
  -- FOREIGN KEY (for_role) REFERENCES roles(role)
);

drop table parking_history;

CREATE TABLE parking_history (
	history_id varchar(25), 
    user_id varchar(15), 
    vehicle_type varchar(25), 
    registration_number varchar(12), 
    parking_spot varchar(3), 
    entry_time timestamp NOT NULL DEFAULT current_timestamp, 
    exit_time timestamp DEFAULT NULL ON UPDATE current_timestamp, 
    fees_amount decimal(7,2) NULL DEFAULT 0.00, 
    fees_paid bool, 
    PRIMARY KEY(history_id),
    FOREIGN KEY (user_id) REFERENCES users(ID));

select * from parking_history;
-- drop table parking_violation;

CREATE TABLE parking_violation (
	violation_id varchar(50), 
    -- student_id varchar(15), 
    -- staff_id varchar(15),
    user_id varchar(15),
    type_of_violation ENUM(
    'Unauthorized Parking',          -- Parking in a restricted or reserved area without authorization
    'Invalid Permit',                -- Parking without an existing permit
    'Existing Dues'					 -- Parking with pending violation dues
	),
    fine_amount decimal(7,2) NOT NULL DEFAULT 0.00,
    fine_paid bool,
    PRIMARY KEY(violation_id),
    FOREIGN KEY (user_id) REFERENCES users(ID));
    -- FOREIGN KEY (student_id) REFERENCES student(SRN),
    -- FOREIGN KEY (staff_id) REFERENCES staff (ID));

select * from parking_violation;
select * from users;
select * from student;

CREATE TABLE permit_type (
    permit_id INT AUTO_INCREMENT PRIMARY KEY,
    permit_name enum('daily', 'semester', 'visitor', 'weekly') NOT NULL,
    validity_period INT NOT NULL,       -- in days
    fee_amount DECIMAL(7,2) NOT NULL    -- cost of the permit
);

drop table parking_permit;

CREATE TABLE parking_permit (
    permit_id INT NOT NULL,
    user_id VARCHAR(15) NOT NULL,      -- SRN for students, ID for staff
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    status ENUM('active', 'expired', 'revoked') NOT NULL,
    PRIMARY KEY (permit_id, user_id, status),
    FOREIGN KEY (permit_id) REFERENCES permit_type(permit_id),
    FOREIGN KEY (user_id) REFERENCES users(ID)  -- Use users table for both students and staff
);

CREATE TABLE visitor_permit (
    visitor_id VARCHAR(15) PRIMARY KEY,
    visitor_name VARCHAR(100),
    vehicle_registration VARCHAR(15),
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    status ENUM('active', 'expired', 'revoked') NOT NULL
);

INSERT INTO roles VALUES ('student');
INSERT INTO roles VALUES ('staff');
INSERT INTO roles VALUES ('admin');

INSERT INTO permit_type(permit_name, validity_period, fee_amount) VALUES('daily', 1, 40.00);
INSERT INTO permit_type(permit_name, validity_period, fee_amount) VALUES('weekly', 1, 280.00);
INSERT INTO permit_type(permit_name, validity_period, fee_amount) VALUES('semester', 180, 7200.00);
INSERT INTO permit_type(permit_name, validity_period, fee_amount) VALUES('visitor', 1, 50.00);

select * from permit_type;
select * from parking_permit;

select * from admin;
select * from student;
select * from professor;

select * from parking_violation;

-- INSERT INTO users VALUES ("PES2UG22CS358", "niks.auckland@gmail.com", "pwdpwd123", "student");

INSERT INTO parking (rowNo, spot_number, is_available) VALUES 
('A', 1, TRUE), ('A', 2, TRUE), ('A', 3, TRUE), ('A', 4, TRUE), ('A', 5, TRUE), ('A', 6, TRUE), ('A', 7, TRUE), ('A', 8, TRUE), ('A', 9, TRUE), ('A', 10, TRUE), 
('A', 11, TRUE), ('A', 12, TRUE), ('A', 13, TRUE), ('A', 14, TRUE), ('A', 15, TRUE), ('A', 16, TRUE), ('A', 17, TRUE), ('A', 18, TRUE), ('A', 19, TRUE), ('A', 20, TRUE),
('A', 21, TRUE), ('A', 22, TRUE), ('A', 23, TRUE), ('A', 24, TRUE), ('A', 25, TRUE), ('A', 26, TRUE), ('A', 27, TRUE), ('A', 28, TRUE), ('A', 29, TRUE), ('A', 30, TRUE), 
('A', 31, TRUE), ('A', 32, TRUE), ('A', 33, TRUE), ('A', 34, TRUE), ('A', 35, TRUE), ('A', 36, TRUE), ('A', 37, TRUE), ('A', 38, TRUE), ('A', 39, TRUE), ('A', 40, TRUE);

INSERT INTO parking (rowNo, spot_number, is_available) VALUES 
('B', 1, TRUE), ('B', 2, TRUE), ('B', 3, TRUE), ('B', 4, TRUE), ('B', 5, TRUE), ('B', 6, TRUE), ('B', 7, TRUE), ('B', 8, TRUE), ('B', 9, TRUE), ('B', 10, TRUE), 
('B', 11, TRUE), ('B', 12, TRUE), ('B', 13, TRUE), ('B', 14, TRUE), ('B', 15, TRUE), ('B', 16, TRUE), ('B', 17, TRUE), ('B', 18, TRUE), ('B', 19, TRUE), ('B', 20, TRUE),
('B', 21, TRUE), ('B', 22, TRUE), ('B', 23, TRUE), ('B', 24, TRUE), ('B', 25, TRUE), ('B', 26, TRUE), ('B', 27, TRUE), ('B', 28, TRUE), ('B', 29, TRUE), ('B', 30, TRUE), 
('B', 31, TRUE), ('B', 32, TRUE), ('B', 33, TRUE), ('B', 34, TRUE), ('B', 35, TRUE), ('B', 36, TRUE), ('B', 37, TRUE), ('B', 38, TRUE), ('B', 39, TRUE), ('B', 40, TRUE);

INSERT INTO parking (rowNo, spot_number, is_available) VALUES 
('C', 1, TRUE), ('C', 2, TRUE), ('C', 3, TRUE), ('C', 4, TRUE), ('C', 5, TRUE), ('C', 6, TRUE), ('C', 7, TRUE), ('C', 8, TRUE), ('C', 9, TRUE), ('C', 10, TRUE), 
('C', 11, TRUE), ('C', 12, TRUE), ('C', 13, TRUE), ('C', 14, TRUE), ('C', 15, TRUE), ('C', 16, TRUE), ('C', 17, TRUE), ('C', 18, TRUE), ('C', 19, TRUE), ('C', 20, TRUE), 
('C', 21, TRUE), ('C', 22, TRUE), ('C', 23, TRUE), ('C', 24, TRUE), ('C', 25, TRUE), ('C', 26, TRUE), ('C', 27, TRUE), ('C', 28, TRUE), ('C', 29, TRUE), ('C', 30, TRUE), 
('C', 31, TRUE), ('C', 32, TRUE), ('C', 33, TRUE), ('C', 34, TRUE), ('C', 35, TRUE), ('C', 36, TRUE), ('C', 37, TRUE), ('C', 38, TRUE), ('C', 39, TRUE), ('C', 40, TRUE);

INSERT INTO parking (rowNo, spot_number, is_available) VALUES 
('D', 1, TRUE), ('D', 2, TRUE), ('D', 3, TRUE), ('D', 4, TRUE), ('D', 5, TRUE), ('D', 6, TRUE), ('D', 7, TRUE), ('D', 8, TRUE), ('D', 9, TRUE), ('D', 10, TRUE), 
('D', 11, TRUE), ('D', 12, TRUE), ('D', 13, TRUE), ('D', 14, TRUE), ('D', 15, TRUE), ('D', 16, TRUE), ('D', 17, TRUE), ('D', 18, TRUE), ('D', 19, TRUE), ('D', 20, TRUE), 
('D', 21, TRUE), ('D', 22, TRUE), ('D', 23, TRUE), ('D', 24, TRUE), ('D', 25, TRUE), ('D', 26, TRUE), ('D', 27, TRUE), ('D', 28, TRUE), ('D', 29, TRUE), ('D', 30, TRUE), 
('D', 31, TRUE), ('D', 32, TRUE), ('D', 33, TRUE), ('D', 34, TRUE), ('D', 35, TRUE), ('D', 36, TRUE), ('D', 37, TRUE), ('D', 38, TRUE), ('D', 39, TRUE), ('D', 40, TRUE);


DELIMITER //

CREATE PROCEDURE CalculateExpiryDate(
    IN validFrom DATE,
    IN validForDays INT,
    OUT expiryDate DATE
)
BEGIN
    SET expiryDate = DATE_ADD(validFrom, INTERVAL validForDays DAY);
END //

DELIMITER ;

-- function to calculate fine amount

DELIMITER //

CREATE FUNCTION CalculateFine(numViolations INT) 
RETURNS DECIMAL(10, 2)
DETERMINISTIC
BEGIN
    DECLARE fineAmount DECIMAL(10, 2);

    IF numViolations = 1 THEN
        SET fineAmount = 50.00; -- Base fine for the first violation
    ELSEIF numViolations = 2 THEN
        SET fineAmount = 100.00; -- Increased fine for second violation
    ELSEIF numViolations > 2 THEN
        SET fineAmount = 150.00 + (numViolations - 2) * 50.00; -- Incremental increase for more violations
    ELSE
        SET fineAmount = 0.00; -- No fine for zero violations
    END IF;

    RETURN fineAmount;
END //

DELIMITER ;

-- trigger to mark parking spot as not available
DELIMITER //

CREATE TRIGGER UpdateParkingAvailability
AFTER INSERT ON ParkingHistory
FOR EACH ROW
BEGIN
    UPDATE Parking
    SET is_available = 0
    WHERE Parking_id = NEW.Parking_spot;
END //

DELIMITER ;

-- trigger to mark the spot as available again

DELIMITER //

CREATE TRIGGER FreeParkingSpot
AFTER DELETE ON ParkingHistory
FOR EACH ROW
BEGIN
    UPDATE Parking
    SET is_available = 1
    WHERE Parking_id = OLD.Parking_spot;
END //

DELIMITER ;

-- procuedure to record entry and exit time

DELIMITER //

CREATE PROCEDURE RecordEntryExit(
    IN userID INT,
    IN parkingSpot INT,
    IN action VARCHAR(10) -- "entry" or "exit"
)
BEGIN
    IF action = 'entry' THEN
        INSERT INTO ParkingHistory (User_ID, Parking_spot, Entry_time)
        VALUES (userID, parkingSpot, NOW());
    ELSEIF action = 'exit' THEN
        UPDATE ParkingHistory
        SET Exit_time = NOW()
        WHERE User_ID = userID AND Parking_spot = parkingSpot AND Exit_time IS NULL;
    END IF;
END //

DELIMITER ;
 
-- function to check parking spot availability

DELIMITER //

CREATE FUNCTION CheckAvailability(parkingID INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE isAvailable BOOLEAN;

    SELECT is_available INTO isAvailable
    FROM Parking
    WHERE Parking_id = parkingID;

    RETURN isAvailable;
END //

DELIMITER ;

-- Procedure to get Violation Summary

DELIMITER //
CREATE PROCEDURE GetUserViolationSummary(IN userID VARCHAR(15))
BEGIN
  SELECT 
    COUNT(*) AS total_violations,
    SUM(CASE WHEN fine_paid = 1 THEN 1 ELSE 0 END) AS paid_violations,
    SUM(CASE WHEN fine_paid = 0 THEN 1 ELSE 0 END) AS unpaid_violations,
    SUM(fine_amount) AS total_fines_collected
  FROM parking_violation
  WHERE user_id = userID;
END //
DELIMITER ;

-- Procedure for Sign Up

DELIMITER //

CREATE PROCEDURE RegisterUser(
    IN p_ID VARCHAR(15), 
    IN p_email VARCHAR(100), 
    IN p_password VARCHAR(100), 
    IN p_role VARCHAR(100), 
    IN p_firstName VARCHAR(50), 
    IN p_lastName VARCHAR(50),
    IN p_semester INT, 
    IN p_section VARCHAR(5), 
    IN p_department VARCHAR(100)
)
BEGIN
    DECLARE exit handler FOR SQLEXCEPTION
    BEGIN
        -- Handle errors
        ROLLBACK;
    END;
  
    START TRANSACTION;
  
    -- Insert into users table
    INSERT INTO users (ID, email, password, role, first_name, last_name) 
    VALUES (p_ID, p_email, p_password, p_role, p_firstName, p_lastName);
  
    -- Insert into specific tables based on userType
    IF p_role = 'student' THEN
        INSERT INTO student (SRN, first_name, last_name, semester, section, department_name) 
        VALUES (p_ID, p_firstName, p_lastName, p_semester, p_section, p_department);
    ELSEIF p_role = 'staff' THEN
        INSERT INTO staff (ID, first_name, last_name, department_name) 
        VALUES (p_ID, p_firstName, p_lastName, p_department);
    ELSEIF p_role = 'admin' THEN
        INSERT INTO admin (ID, first_name, last_name) 
        VALUES (p_ID, p_firstName, p_lastName);
    END IF;

    COMMIT;
END //

DELIMITER ;

-- Procedure for reserving a spot

DELIMITER $$

CREATE PROCEDURE ReserveParkingSpot(IN p_userID VARCHAR(15), IN p_rowNo CHAR(1), IN p_spot_number VARCHAR(3))
BEGIN
    DECLARE spot_available BOOLEAN;
    DECLARE spot_count INT;

    -- Check if the user has already reserved a spot
    IF EXISTS (SELECT 1 FROM parking WHERE reserved_by = p_userID LIMIT 1) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User has already reserved a spot.';
    END IF;

    -- Ensure only one result is returned for availability check
    SELECT COUNT(*) INTO spot_count
    FROM parking
    WHERE rowNo = p_rowNo AND spot_number = p_spot_number;

    -- If no row is found for the spot, it means the spot does not exist
    IF spot_count = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Spot does not exist.';
    END IF;

    -- Check if the spot is available
    SELECT is_available INTO spot_available
    FROM parking
    WHERE rowNo = p_rowNo AND spot_number = p_spot_number
    LIMIT 1;

    IF spot_available = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Spot not available.';
    END IF;

    -- Reserve the spot by updating the parking table
    UPDATE parking
    SET is_available = FALSE, reserved_by = p_userID
    WHERE rowNo = p_rowNo AND spot_number = p_spot_number;

    COMMIT;
END$$

DELIMITER ;

select * from parking;

-- Function to log in

DELIMITER $$

CREATE FUNCTION validate_login(userID VARCHAR(15), pass VARCHAR(255))
RETURNS JSON
DETERMINISTIC
BEGIN
  DECLARE user_json JSON;

  SELECT 
    JSON_OBJECT('id', u.ID, 'email', u.email, 'role', u.role) 
    INTO user_json
  FROM users u
  WHERE u.ID = userID AND u.password = pass;

  RETURN user_json;
END $$

DELIMITER ;
