// import type { Request, Response } from 'express-serve-static-core';
// import Video from './models/Video'; // Adjust this path to your actual Video model location

// // 1. Define the shape of incoming query parameters from the URL
// interface GetVideosQuery {
//     university?: string;
//     branch?: string;
//     semester?: string;
//     subject?: string;
//     isExamOriented?: string;
//     unit?: string;
//     search?: string;
// }

// // @desc    Get videos based on filters
// // @route   GET /api/videos
// export const getVideos = async (
//     req: Request, // Type definitions for req.params, req.body, req.query
//     res: Response
// ): Promise<void> => {
//     try {
//         const { university, branch, semester, subject, isExamOriented, unit, search } = req.query;

//         // 2. Explicitly type the MongoDB query object
//         const query: Record<string, any> = {};

//         // 3. Sanitize inputs and prevent empty strings or whitespaces from breaking queries
//         if (university && university.trim() !== '') query.university = university.trim();
//         if (branch && branch.trim() !== '') query.branch = branch.trim();
//         if (semester && semester.trim() !== '') query.semester = semester.trim();
//         if (subject && subject.trim() !== '') query.subject = subject.trim();
//         if (unit && unit.trim() !== '') query.unit = unit.trim();
        
//         // Match string-based true/false from your DB screenshot
//         if (isExamOriented && isExamOriented.trim() !== '') {
//             query.isExamOriented = isExamOriented.trim(); 
//         }

//         if (search && search.trim() !== '') {
//             query.$or = [
//                 { title: { $regex: search.trim(), $options: 'i' } },
//                 { topic: { $regex: search.trim(), $options: 'i' } }
//             ];
//         }

//         console.log("Constructed MongoDB Query:", query);

//         // 4. Execute the dynamic query against the database
//         const videos = await Video.find(query)
//             .select('-transcript -vectorEmbedding -questions')
//             .sort({ voteScore: -1 });

//         console.log(`Found ${videos.length} videos`);
//         res.json(videos);
//     } catch (error) {
//         console.error("Error fetching videos:", error);
//         res.status(500).json({ message: "Server Error: Could not fetch videos" });
//     }
// };
