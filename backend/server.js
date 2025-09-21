import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Test route
app.get("/", (req, res) => {
  res.send("Hogwarts Backend with Supabase is running ⚡");
});
// Teacher Signup
app.post("/teacher/signup", async (req, res) => {
    const { name, email, password } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const { data, error } = await supabase
      .from("teachers")
      .insert([{ name, email, password: hashedPassword }]);
  
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Teacher registered successfully", data });
  });
  
  // Teacher Login
  app.post("/teacher/login", async (req, res) => {
    const { email, password } = req.body;
  
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("email", email)
      .single();
  
    if (error || !data) return res.status(400).json({ error: "Teacher not found" });
  
    const valid = await bcrypt.compare(password, data.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });
  
    res.json({ message: "Login successful", teacher: data });
  });
  
  // Student Signup
  app.post("/student/signup", async (req, res) => {
    const { name, email, password } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const { data, error } = await supabase
      .from("students")
      .insert([{ name, email, password: hashedPassword }]);
  
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Student registered successfully", data });
  });
  
  // Student Login
  app.post("/student/login", async (req, res) => {
    const { email, password } = req.body;
  
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("email", email)
      .single();
  
    if (error || !data) return res.status(400).json({ error: "Student not found" });
  
    const valid = await bcrypt.compare(password, data.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });
  
    res.json({ message: "Login successful", student: data });
  });
  
  // Signup route for teacher
app.post('/teacher/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error } = await supabase
        .from('teachers')
        .insert([{ name, email, password: hashedPassword }]);
  
      if (error) throw error;
      res.json({ message: "Teacher registered successfully!" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Signup route for student
  app.post('/student/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error } = await supabase
        .from('students')
        .insert([{ name, email, password: hashedPassword }]);
  
      if (error) throw error;
      res.json({ message: "Student registered successfully!" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
