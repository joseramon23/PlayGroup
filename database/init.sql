-- Tabla usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('director', 'profesor', 'webadmin') DEFAULT 'profesor',
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla guarderia
CREATE TABLE kindergarten (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla alumnos
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    birthdate DATE,
    kindergarten_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kindergarten_id) REFERENCES kindergarten(id) ON DELETE CASCADE
);

-- Tabla comidas
CREATE TABLE meals_diary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  first_meal TINYINT(1) DEFAULT 0,
  second_meal TINYINT(1) DEFAULT 0,
  dessert TINYINT(1) DEFAULT 0,
  snack TINYINT(1) DEFAULT 0,
  date DATE NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Tabla siestas
CREATE TABLE naps_diary (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  time INT,
  timezone ENUM('morning', 'noon', 'afternoon'),
  date DATE NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Tabla notas
CREATE TABLE notes_diary (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  content TEXT,
  date DATE NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Tabla asistencia
CREATE TABLE attendance_diary (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  entrance_time TIME,
  exit_time TIME,
  date DATE NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Tabla agenda
CREATE TABLE diary (
  id INT PRIMARY KEY,
  student_id INT NOT NULL,
  deposition INT,
  meal_id INT,
  nap_id INT,
  note_id INT,
  attendance_id INT,
  date DATE,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (meal_id) REFERENCES meals_diary(id),
  FOREIGN KEY (nap_id) REFERENCES naps_diary(id),
  FOREIGN KEY (note_id) REFERENCES notes_diary(id),
  FOREIGN KEY (attendance_id) REFERENCES attendance_diary(id)
);

-- Tabla recuperar contraseña
CREATE TABLE password_reset_token (
  email VARCHAR(100) PRIMARY KEY,
  token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (email) REFERENCES users(email)
);

-- Añadir nueva columna a users
ALTER TABLE users
ADD COLUMN kindergarten_id INT,
ADD CONSTRAINT fk_users_kindergarten
FOREIGN KEY (kindergarten_id) REFERENCES kindergarten(id) ON DELETE CASCADE;