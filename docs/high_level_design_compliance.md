# High-Level Design Discussion: ShiftSync

To ensure a robust architecture, we have analyzed the system from three distinct perspectives: **Product (UX)**, **System Architecture**, and **Algorithm Engineering**.

## 1. The Product Perspective 📱
**Focus:** User Experience, Mobile-First, Real-time Validation.

*   **Critique:** "Admin panels are often desktop-only. For ShiftSync to succeed, store managers effectively need to manage rosters from an iPad or phone while on the floor."
*   **Requirement Refinement:**
    *   **Mobile Drag-and-Drop:** Standard desktop drag-and-drop libraries (dnd-kit) often feel clunky on touch. We need a rigorous evaluation of touch interactions. *Proposal: Use tap-to-select + tap-to-assign pattern on mobile, drag-and-drop only on desktop.*
    *   **Notifications:** "If the algorithm changes a shift, does the user know?" We need a reliable notification queue (e.g., optimistic UI updates + toast notifications).

## 2. The System Architect Perspective 🏗
**Focus:** Scalability, Data Integrity, Next.js Patterns.

*   **Critique:** "The Custom Scheduling Engine is compute-heavy. Running a Genetic Algorithm inside a Next.js Serverless Function (Lambda) is risky due to timeout limits (usually 10-60s)."
*   **Architectural Decision:**
    *   **Short-term:** Run the engine as a Next.js API route but limit the algorithm's runtime iterations (Timeboxed execution).
    *   **Long-term:** We must decouple the Engine into a separate Worker (Node.js script or simple Docker container) that polls for jobs, or use a Queue (Redis/Bull user optional).
    *   **Database:** Prisma is great, but we need to ensure the `JSONB` column for algorithm parameters doesn't become a "garbage dump" of unstructured data. We will enforce a Zod schema for that JSON column at the application level.

## 3. The Algorithm Engineer Perspective 🧠
**Focus:** Optimization Quality, constraint modeling.

*   **Critique:** "A pure 'Heuristic' (Greedy) approach is too simple; it hits local optima easily. A pure 'Genetic Algorithm' is slow to converge."
*   **Proposal:** **Hybrid Approach.**
    1.  **Phase 1 (Construction):** Use a greedy heuristic to build a valid, non-empty roster instantly. (Fulfills hard constraints).
    2.  **Phase 2 (Optimization):** Use Simulated Annealing or Hill Climbing to swap shifts and improve the score (Soft constraints: fairness, preferences) over a 5-10 second window.
    *   **Data Structure:** The "Gene" should be `[ShiftID, EmployeeID]`. The "Genome" is the array of all shifts.

## 4. Consensus & Action Plan
1.  **UX**: Implement "Tap-to-Assign" for mobile to ensure usability.
2.  **Arch**: Start with Timeboxed API Routes for the engine (simpler deployment) but design the interface to be async (Job ID based) from day one.
3.  **Algo**: Implement the Hybrid Construction + Local Search strategy in TypeScript.

---
**Open Question for Stakeholder:**
Are you comfortable with the **Async Job** pattern for the storage engine? (User clicks "Auto-Schedule", sees a "Calculating..." spinner for ~5-10 seconds, then results appear). This is more complex to build than synchronous but essential for reliability.
