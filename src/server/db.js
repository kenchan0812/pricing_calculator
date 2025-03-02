import Database from "better-sqlite3";

/**
 * ==============================
 * === MOCK DATABASE SETUP ===
 * ==============================
 * This file initializes a mock SQLite database using `better-sqlite3`.
 * It sets up tables for teams, projects, calculators, variables, and notes.
 * The script also inserts mock data to simulate an environment for testing.
 */

// Initialize SQLite database
const db = new Database("database.sqlite");

// Enable foreign key constraints
db.pragma("foreign_keys = ON");

// Create necessary tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS Teams (
        team_id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Projects (
        project_id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER NOT NULL,
        project_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Calculators (
        calculator_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        parent_calculator_id INTEGER NULL,
        calculator_name TEXT NOT NULL,
        expression TEXT,
        result REAL DEFAULT NULL, -- Stores computed result of the expression
        note_id INTEGER NULL, -- Links to a note if applicable
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
        FOREIGN KEY (parent_calculator_id) REFERENCES Calculators(calculator_id) ON DELETE CASCADE,
        FOREIGN KEY (note_id) REFERENCES Notes(note_id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS Variables (
        variable_id INTEGER PRIMARY KEY,  
        calculator_id INTEGER NOT NULL,
        variable_name TEXT NOT NULL,
        variable_display TEXT NOT NULL,
        variable_value REAL NOT NULL, -- Holds numerical values for calculations
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (calculator_id) REFERENCES Calculators(calculator_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Notes (
        note_id INTEGER PRIMARY KEY AUTOINCREMENT,
        calculator_id INTEGER NOT NULL,
        note_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (calculator_id) REFERENCES Calculators(calculator_id) ON DELETE CASCADE
    );
`);

/**
 * Inserts mock data into the database if tables are empty.
 * - Ensures that at least one team, project, calculator, and note exist.
 * - Links notes to calculators where applicable.
 */
const insertMockData = () => {
  db.exec(`
    -- Insert 'Team 1' if it does not exist
    INSERT INTO Teams (team_name) 
    SELECT 'Team 1' 
    WHERE NOT EXISTS (SELECT 1 FROM Teams WHERE team_name = 'Team 1');

    -- Insert a project for 'Team 1' if it does not exist
    INSERT INTO Projects (team_id, project_name)
    SELECT team_id, 'Team 1 Project'
    FROM Teams
    WHERE team_name = 'Team 1'
    AND NOT EXISTS (SELECT 1 FROM Projects WHERE team_id = Teams.team_id);

    -- Insert a root calculator for 'Team 1's project if it does not exist
    INSERT INTO Calculators (project_id, parent_calculator_id, calculator_name, note_id)
    SELECT P.project_id, NULL, 'Root Calculator', NULL
    FROM Projects P
    JOIN Teams T ON P.team_id = T.team_id
    WHERE T.team_name = 'Team 1'
    AND NOT EXISTS (
        SELECT 1 FROM Calculators C WHERE C.project_id = P.project_id
    );

    -- Insert a note for the root calculator if it does not exist
    INSERT INTO Notes (calculator_id, note_content)
    SELECT C.calculator_id, 'Root calculator note'
    FROM Calculators C
    JOIN Projects P ON C.project_id = P.project_id
    JOIN Teams T ON P.team_id = T.team_id
    WHERE T.team_name = 'Team 1'
    AND C.parent_calculator_id IS NULL
    AND NOT EXISTS (
        SELECT 1 FROM Notes N WHERE N.calculator_id = C.calculator_id
    );

    -- Update the root calculator to link it with the note
    UPDATE Calculators
    SET note_id = (SELECT N.note_id FROM Notes N WHERE N.calculator_id = Calculators.calculator_id)
    WHERE calculator_id IN (
        SELECT C.calculator_id FROM Calculators C
        JOIN Projects P ON C.project_id = P.project_id
        JOIN Teams T ON P.team_id = T.team_id
        WHERE T.team_name = 'Team 1' AND C.parent_calculator_id IS NULL
    )
    AND note_id IS NULL;
  `);
};

// Run the function to insert mock data
insertMockData();

export default db;
