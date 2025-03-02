import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// =====================================
// ========== TEAMS ENDPOINT ===========
// =====================================
/**
 * GET /teams
 * Fetch all teams from the database.
 * Returns an array of teams.
 */
app.get("/teams", (req, res) => {
  const stmt = db.prepare("SELECT * FROM Teams");
  const teams = stmt.all();
  res.json(teams);
});

/**
 * POST /teams
 * Create a new team with a default project and root calculator.
 *
 * Request Body:
 * - team_name: string (Name of the team)
 *
 * Returns:
 * - success: boolean
 * - team_id: number (ID of the newly created team)
 * - project_id: number (ID of the created project)
 */
app.post("/teams", (req, res) => {
  const { team_name } = req.body;
  const insertTeamStmt = db.prepare("INSERT INTO Teams (team_name) VALUES (?)");
  const teamInfo = insertTeamStmt.run(team_name);
  const teamId = teamInfo.lastInsertRowid;

  // Create a default project for the new team
  const insertProjectStmt = db.prepare(
    "INSERT INTO Projects (team_id, project_name) VALUES (?, ?)"
  );
  const projectInfo = insertProjectStmt.run(teamId, "Default Project");

  // Create a root calculator for the default project
  const calculatorStmt = db.prepare(
    "INSERT INTO Calculators (project_id, parent_calculator_id, calculator_name, note_id) VALUES (?, NULL, ?, NULL)"
  );
  const calculatorInfo = calculatorStmt.run(
    projectInfo.lastInsertRowid,
    "Root Calculator"
  );
  const root_calculator_id = calculatorInfo.lastInsertRowid;

  // Create a root note for the root calculator
  const noteStmt = db.prepare(
    "INSERT INTO Notes (calculator_id, note_content) VALUES (?, ?)"
  );
  const noteInfo = noteStmt.run(root_calculator_id, "Root calculator note");
  const note_id = noteInfo.lastInsertRowid;

  // Update the calculator with the created note
  const updateCalculatorStmt = db.prepare(
    "UPDATE Calculators SET note_id = ? WHERE calculator_id = ?"
  );
  updateCalculatorStmt.run(note_id, root_calculator_id);

  res.json({
    success: true,
    team_id: teamId,
    project_id: projectInfo.lastInsertRowid,
  });
});

/**
 * PUT /teams/:id
 * Update the name of a team.
 *
 * Request Parameters:
 * - id: number (Team ID to update)
 *
 * Request Body:
 * - team_name: string (New team name)
 *
 * Returns:
 * - success: boolean
 */
app.put("/teams/:id", (req, res) => {
  const { id } = req.params;
  const { team_name } = req.body;
  const stmt = db.prepare(
    "UPDATE Teams SET team_name = ?, updated_at = CURRENT_TIMESTAMP WHERE team_id = ?"
  );
  stmt.run(team_name, id);
  res.json({ success: true });
});

/**
 * DELETE /teams/:id
 * Delete a team by ID.
 *
 * Request Parameters:
 * - id: number (Team ID to delete)
 *
 * Returns:
 * - success: boolean
 */
app.delete("/teams/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM Teams WHERE team_id = ?");
  stmt.run(id);
  res.json({ success: true });
});

// =====================================
// ========= PROJECTS ENDPOINT =========
// =====================================

/**
 * GET /projects
 * Fetch all projects for a given team.
 *
 * Query Parameters:
 * - team_id: number (Required, ID of the team)
 *
 * Returns:
 * - Array of projects
 */
app.get("/projects", (req, res) => {
  const { team_id } = req.query;
  if (!team_id) {
    return res.status(400).json({ error: "team_id is required" });
  }
  const stmt = db.prepare("SELECT * FROM Projects WHERE team_id = ?");
  const projects = stmt.all(team_id);
  res.json(projects);
});

/**
 * POST /projects
 * Create a new project under a team, with a root calculator and note.
 *
 * Request Body:
 * - team_id: number (ID of the team to create a project for)
 * - project_name: string (Name of the new project)
 *
 * Returns:
 * - success: boolean
 * - project_id: number (ID of the created project)
 * - root_calculator_id: number (ID of the root calculator)
 * - note_id: number (ID of the root note)
 */
app.post("/projects", (req, res) => {
  const { team_id, project_name } = req.body;
  if (!team_id || !project_name) {
    return res
      .status(400)
      .json({ error: "team_id and project_name are required" });
  }
  const transaction = db.transaction(() => {
    const projectStmt = db.prepare(
      "INSERT INTO Projects (team_id, project_name) VALUES (?, ?)"
    );
    const projectInfo = projectStmt.run(team_id, project_name);
    const project_id = projectInfo.lastInsertRowid;

    const calculatorStmt = db.prepare(
      "INSERT INTO Calculators (project_id, parent_calculator_id, calculator_name, note_id) VALUES (?, NULL, ?, NULL)"
    );
    const calculatorInfo = calculatorStmt.run(project_id, project_name);
    const root_calculator_id = calculatorInfo.lastInsertRowid;

    const noteStmt = db.prepare(
      "INSERT INTO Notes (calculator_id, note_content) VALUES (?, ?)"
    );
    const noteInfo = noteStmt.run(root_calculator_id, "Root calculator note");
    const note_id = noteInfo.lastInsertRowid;

    const updateCalculatorStmt = db.prepare(
      "UPDATE Calculators SET note_id = ? WHERE calculator_id = ?"
    );
    updateCalculatorStmt.run(note_id, root_calculator_id);

    return { project_id, root_calculator_id, note_id };
  });
  const { project_id, root_calculator_id, note_id } = transaction();
  res.json({ success: true, project_id, root_calculator_id, note_id });
});

/**
 * PUT /projects/:id
 * Update the name of a project.
 *
 * Request Parameters:
 * - id: number (Project ID to update)
 *
 * Request Body:
 * - project_name: string (New project name)
 *
 * Returns:
 * - success: boolean
 */
app.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { project_name } = req.body;
  if (!project_name) {
    return res.status(400).json({ error: "project_name is required" });
  }
  const stmt = db.prepare(
    "UPDATE Projects SET project_name = ?, updated_at = CURRENT_TIMESTAMP WHERE project_id = ?"
  );
  stmt.run(project_name, id);
  res.json({ success: true });
});

/**
 * DELETE /projects/:id
 * Delete a project by ID.
 */
app.delete("/projects/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM Projects WHERE project_id = ?");
  stmt.run(id);
  res.json({ success: true });
});

// =====================================
// ======== CALCULATOR ENDPOINT ========
// =====================================

/**
 * GET /calculator/:project_id/:parent_calculator_id/:calculator_id
 * Retrieve a calculator by project ID, supporting both root and child calculators.
 *
 * Params:
 * - project_id (string, required)
 * - parent_calculator_id (string, required, "null" for root)
 * - calculator_id (string, required, "null" for root)
 *
 * Response:
 * - 200: Calculator details
 * - 400: Missing parameters
 * - 404: Calculator not found
 */
app.get(
  "/calculator/:project_id/:parent_calculator_id/:calculator_id",
  (req, res) => {
    const { project_id, parent_calculator_id, calculator_id } = req.params;

    if (!project_id) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    if (!calculator_id && parent_calculator_id !== "null") {
      return res.status(400).json({ error: "Calculator ID is required" });
    }
    if (parent_calculator_id === "null" && calculator_id === "null") {
      const rootStmt = db.prepare(`
      SELECT c.*, 
             COALESCE(json_group_array(
               CASE WHEN v.variable_id IS NOT NULL THEN json_object(
                 'variable_id', v.variable_id,
                 'variable_name', v.variable_name,
                 'variable_display', v.variable_display,
                 'variable_value', v.variable_value
               ) END
             ), '[]') AS variables,
             COALESCE(json_object(
               'note_id', n.note_id,
               'note_content', n.note_content
             ), '{}') AS note
      FROM Calculators c
      LEFT JOIN Variables v ON c.calculator_id = v.calculator_id
      LEFT JOIN Notes n ON c.note_id = n.note_id
      WHERE c.project_id = ? AND c.parent_calculator_id IS NULL
      GROUP BY c.calculator_id
      LIMIT 1
    `);
      const rootCalculator = rootStmt.get(project_id);

      if (rootCalculator) {
        return res.json(rootCalculator);
      }
    } else {
      const stmt = db.prepare(`
      SELECT c.*, 
             COALESCE(json_group_array(
               CASE WHEN v.variable_id IS NOT NULL THEN json_object(
                 'variable_id', v.variable_id,
                 'variable_name', v.variable_name,
                 'variable_display', v.variable_display,
                 'variable_value', v.variable_value
               ) END
             ), '[]') AS variables,
             COALESCE(json_object(
               'note_id', n.note_id,
               'note_content', n.note_content
             ), '{}') AS note
      FROM Calculators c
      LEFT JOIN Variables v ON c.calculator_id = v.calculator_id
      LEFT JOIN Notes n ON c.note_id = n.note_id
      WHERE c.project_id = ? AND c.calculator_id = ?
      GROUP BY c.calculator_id
    `);
      const calculator = stmt.get(project_id, calculator_id);

      if (calculator) {
        return res.json(calculator);
      }
    }

    res
      .status(404)
      .json({ error: "No calculator found for this project and parent" });
  }
);

/**
 * GET /nestedCalculator/:project_id/:parent_calculator_id
 * Retrieve all child calculators under a specific parent calculator within a project.
 *
 * Params:
 * - project_id (string, required)
 * - parent_calculator_id (string, required)
 *
 * Response:
 * - 200: List of child calculators
 * - 400: Missing parameters
 */
app.get("/nestedCalculator/:project_id/:parent_calculator_id", (req, res) => {
  const { project_id, parent_calculator_id } = req.params;

  if (!project_id) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  if (parent_calculator_id === "null") {
    return res.status(400).json({ error: "Parent Calculator ID is required" });
  }

  const childStmt = db.prepare(`
    SELECT c.*, 
           COALESCE(json_group_array(
             CASE WHEN v.variable_id IS NOT NULL THEN json_object(
               'variable_id', v.variable_id,
               'variable_name', v.variable_name,
               'variable_display', v.variable_display,
               'variable_value', v.variable_value
             ) END
           ), '[]') AS variables,
           COALESCE(json_object(
             'note_id', n.note_id,
             'note_content', n.note_content
           ), '{}') AS note
    FROM Calculators c
    LEFT JOIN Variables v ON c.calculator_id = v.calculator_id
    LEFT JOIN Notes n ON c.note_id = n.note_id
    WHERE c.project_id = ? AND c.parent_calculator_id = ?
    GROUP BY c.calculator_id
  `);

  const childCalculators = childStmt.all(project_id, parent_calculator_id);

  return res.json(childCalculators);
});

/**
 * GET /calculatorHierarchy/:project_id
 * Retrieve the hierarchical structure of calculators within a project,
 * including nested child calculators, associated variables, and notes.
 *
 * Params:
 * - project_id (string, required)
 *
 * Response:
 * - 200: Returns hierarchy structure
 * - 400: Missing project_id
 * - 404: No root calculator found
 */
app.get("/calculatorHierarchy/:project_id", (req, res) => {
  const { project_id } = req.params;

  if (!project_id) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  const getCalculatorHierarchy = (parent_calculator_id) => {
    const stmt = db.prepare(`
      SELECT c.*, 
             COALESCE(json_group_array(
               CASE WHEN v.variable_id IS NOT NULL THEN json_object(
                 'variable_id', v.variable_id,
                 'variable_name', v.variable_name,
                 'variable_display', v.variable_display,
                 'variable_value', v.variable_value
               ) END
             ), '[]') AS variables,
             COALESCE(json_object(
               'note_id', n.note_id,
               'note_content', n.note_content
             ), '{}') AS note
      FROM Calculators c
      LEFT JOIN Variables v ON c.calculator_id = v.calculator_id
      LEFT JOIN Notes n ON c.note_id = n.note_id
      WHERE c.project_id = ? AND c.parent_calculator_id IS ?
      GROUP BY c.calculator_id
    `);

    const calculators = stmt.all(project_id, parent_calculator_id);

    return calculators.map((calculator) => ({
      ...calculator,
      children: getCalculatorHierarchy(calculator.calculator_id),
    }));
  };

  const rootStmt = db.prepare(`
    SELECT c.*, 
           COALESCE(json_group_array(
             CASE WHEN v.variable_id IS NOT NULL THEN json_object(
               'variable_id', v.variable_id,
               'variable_name', v.variable_name,
               'variable_display', v.variable_display,
               'variable_value', v.variable_value
             ) END
           ), '[]') AS variables,
           COALESCE(json_object(
             'note_id', n.note_id,
             'note_content', n.note_content
           ), '{}') AS note
    FROM Calculators c
    LEFT JOIN Variables v ON c.calculator_id = v.calculator_id
    LEFT JOIN Notes n ON c.note_id = n.note_id
    WHERE c.project_id = ? AND c.parent_calculator_id IS NULL
    GROUP BY c.calculator_id
  `);

  const rootCalculator = rootStmt.get(project_id);

  if (!rootCalculator) {
    return res.status(404).json({ error: "No root calculator found" });
  }

  rootCalculator.children = getCalculatorHierarchy(
    rootCalculator.calculator_id
  );

  res.json(rootCalculator);
});

/**
 * POST /calculator
 * Create a new calculator within a project, optionally under a parent calculator.
 * A new note is also created and linked to the calculator.
 *
 * Request:
 * - project_id (number, required)
 * - parent_calculator_id (number|null, required)
 * - calculator_name (string, required)
 *
 * Response:
 * - 201: Calculator created successfully
 * - 400: Missing required parameters
 */
app.post("/calculator", (req, res) => {
  const { project_id, parent_calculator_id, calculator_name } = req.body;
  if (!project_id) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  if (!calculator_name) {
    return res.status(400).json({ error: "Calculator Name is required" });
  }

  if (parent_calculator_id === null) {
    return res
      .status(400)
      .json({ error: "Parent Calculator ID cannot be null" });
  }
  const insertCalculatorStmt = db.prepare(`
    INSERT INTO Calculators (project_id, parent_calculator_id, calculator_name) 
    VALUES (?, ?, ?);
  `);
  const result = insertCalculatorStmt.run(
    project_id,
    parent_calculator_id,
    calculator_name
  );
  const calculator_id = result.lastInsertRowid;
  const noteStmt = db.prepare(`
    INSERT INTO Notes (calculator_id, note_content) VALUES (?, ?);
  `);
  const noteInfo = noteStmt.run(calculator_id, "");
  const note_id = noteInfo.lastInsertRowid;

  const updateCalculatorStmt = db.prepare(`
    UPDATE Calculators SET note_id = ? WHERE calculator_id = ?;
  `);
  updateCalculatorStmt.run(note_id, calculator_id);
  res.status(201).json({
    message: "Calculator created successfully",
    calculator_id,
    project_id,
    parent_calculator_id,
    variables: [],
    note: "",
  });
});

/**
 * PUT /calculators/:id
 * Update a calculator's name, expression, result, or note.
 *
 * Params:
 * - id: number (Calculator ID) [Required]
 *
 * Body:
 * - calculator_name: string [Required]
 * - expression, result, note: string [Optional]
 *
 * Responses:
 * - 200: Success message
 * - 400: Missing required fields
 * - 404: Calculator not found or no changes made
 */

app.put("/calculators/:id", (req, res) => {
  const { id } = req.params;
  const { calculator_name, expression, result, note } = req.body;

  if (!id || !calculator_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let stmt;
  if (
    expression === undefined &&
    result === undefined &&
    note === undefined &&
    calculator_name !== undefined
  ) {
    stmt = db.prepare(
      `UPDATE Calculators 
       SET calculator_name = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE calculator_id = ?`
    );
    stmt.run(calculator_name, id);
    return res.json({
      success: true,
      message: "Calculator name updated successfully",
    });
  }

  stmt = db.prepare(
    `UPDATE Calculators 
     SET calculator_name = ?, expression = ?, result = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE calculator_id = ?`
  );

  const resultUpdate = stmt.run(calculator_name, expression, result, id);
  if (resultUpdate.changes > 0) {
    if (note !== undefined) {
      const noteStmt = db.prepare(
        `SELECT note_id FROM Calculators WHERE calculator_id = ?`
      );
      const existingNote = noteStmt.get(id);

      if (existingNote) {
        const updateNoteStmt = db.prepare(
          `UPDATE Notes 
           SET note_content = ?, updated_at = CURRENT_TIMESTAMP 
           WHERE note_id = ?`
        );
        updateNoteStmt.run(note, existingNote.note_id);
      } else {
        const insertNoteStmt = db.prepare(
          "INSERT INTO Notes (calculator_id, note_content) VALUES (?, ?)"
        );
        const noteInfo = insertNoteStmt.run(id, note);
        const note_id = noteInfo.lastInsertRowid;

        const updateCalculatorNoteStmt = db.prepare(
          "UPDATE Calculators SET note_id = ? WHERE calculator_id = ?"
        );
        updateCalculatorNoteStmt.run(note_id, id);
      }
    }

    res.json({ success: true, message: "Calculator updated successfully" });
  } else {
    res.status(404).json({ error: "Calculator not found or no changes made" });
  }
});

/**
 * DELETE /calculators/:calculator_id
 * Delete a calculator by its ID.
 *
 * Params:
 * - calculator_id (string, required)
 *
 * Response:
 * - 200: Calculator deleted successfully
 * - 400: Missing calculator ID
 * - 404: Calculator not found
 */

app.delete("/calculators/:calculator_id", (req, res) => {
  const { calculator_id } = req.params;
  if (!calculator_id) {
    return res.status(400).json({ error: "Calculator ID is required" });
  }

  const deleteCalculatorStmt = db.prepare(`
    DELETE FROM Calculators WHERE calculator_id = ?
  `);
  const result = deleteCalculatorStmt.run(calculator_id);
  if (result.changes > 0) {
    return res.json({
      success: true,
      message: "Calculator deleted successfully",
    });
  } else {
    return res.status(404).json({ error: "Calculator not found" });
  }
});

// =====================================
// ========== VARIABLES ENDPOINT =======
// =====================================

/**
 * GET /variables
 * Retrieve all variables from the database.
 *
 * Returns:
 * - 200 OK: Array of all variables.
 */
app.get("/variables", (req, res) => {
  const stmt = db.prepare("SELECT * FROM Variables");
  const variables = stmt.all();
  res.json(variables);
});

/**
 * POST /variables
 * Create a new variable and associate it with a calculator.
 *
 * Request Body:
 * - calculator_id: number (ID of the calculator) [Required]
 * - variable_name: string (Name of the variable) [Required]
 * - variable_display: string (Display name of the variable) [Required]
 * - variable_value: any (Value assigned to the variable) [Required]
 *
 * Returns:
 * - 200 OK:
 *   - success: boolean
 *   - variable_id: number (ID of the newly created variable)
 */
app.post("/variables", (req, res) => {
  const { calculator_id, variable_name, variable_display, variable_value } =
    req.body;
  const stmt = db.prepare(
    "INSERT INTO Variables (calculator_id, variable_name, variable_display, variable_value) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(
    calculator_id,
    variable_name,
    variable_display,
    variable_value
  );
  res.json({ success: true, variable_id: info.lastInsertRowid });
});

/**
 * PUT /variables/:id
 * Update an existing variable's details.
 *
 * Path Parameters:
 * - id: number (ID of the variable to update)
 *
 * Request Body:
 * - variable_name: string (Updated name of the variable) [Optional]
 * - variable_display: string (Updated display name) [Optional]
 * - variable_value: any (Updated value of the variable) [Optional]
 *
 * Returns:
 * - 200 OK:
 *   - success: boolean
 */
app.put("/variables/:id", (req, res) => {
  const { id } = req.params;
  const { variable_name, variable_display, variable_value } = req.body;

  const stmt = db.prepare(
    "UPDATE Variables SET variable_name = ?, variable_display = ?, variable_value = ?, updated_at = CURRENT_TIMESTAMP WHERE variable_id = ?"
  );

  stmt.run(variable_name, variable_display, variable_value, id);
  res.json({ success: true });
});

/**
 * DELETE /variables/:id
 * Delete a variable from the database.
 *
 * Path Parameters:
 * - id: number (ID of the variable to delete)
 *
 * Returns:
 * - 200 OK:
 *   - success: boolean
 * - 404 Not Found:
 *   - success: false
 *   - message: "Variable not found"
 */
app.delete("/variables/:id", (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare("DELETE FROM Variables WHERE variable_id = ?");
  const result = stmt.run(id);

  if (result.changes === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Variable not found" });
  }

  res.json({ success: true });
});

// =====================================
// ========== NOTES ENDPOINT ===========
// =====================================

/**
 * GET /notes
 * Retrieve all notes from the database.
 *
 * Returns:
 * - 200 OK: Array of all notes.
 */
app.get("/notes", (req, res) => {
  const stmt = db.prepare("SELECT * FROM Notes");
  const notes = stmt.all();
  res.json(notes);
});

/**
 * POST /notes
 * Create a new note and associate it with a calculator.
 *
 * Request Body:
 * - calculator_id: number (ID of the calculator) [Required]
 * - note_content: string (Content of the note) [Required]
 *
 * Returns:
 * - 200 OK:
 *   - success: boolean
 *   - note_id: number (ID of the newly created note)
 */
app.post("/notes", (req, res) => {
  const { calculator_id, note_content } = req.body;
  const stmt = db.prepare(
    "INSERT INTO Notes (calculator_id, note_content) VALUES (?, ?)"
  );
  const info = stmt.run(calculator_id, note_content);
  res.json({ success: true, note_id: info.lastInsertRowid });
});

/**
 * PUT /notes/:id
 * Update an existing note's content.
 *
 * Path Parameters:
 * - id: number (ID of the note to update)
 *
 * Request Body:
 * - note_content: string (Updated content of the note) [Required]
 *
 * Returns:
 * - 200 OK:
 *   - success: boolean
 */
app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { note_content } = req.body;
  const stmt = db.prepare(
    "UPDATE Notes SET note_content = ?, updated_at = CURRENT_TIMESTAMP WHERE note_id = ?"
  );
  stmt.run(note_content, id);
  res.json({ success: true });
});

/**
 * Start the server and listen on the specified port.
 */
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
