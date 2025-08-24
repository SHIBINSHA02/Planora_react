// src/components/data/teacher.js
export const teacher=[
    { 
      id: 1, 
      name: 'Dr. Smith', 
      subjects: ['Mathematics'], 
      classes: ['S1', 'S2', 'S3', 'S4'] // Can teach math to all classes
    },
    { 
      id: 2, 
      name: 'Ms. Johnson', 
      subjects: ['English'], 
      classes: ['S1', 'S2', 'S3', 'S4', 'S5'] // Can teach English to all classes
    },
    { 
      id: 3, 
      name: 'Mr. Brown', 
      subjects: ['Physics', 'Science'], 
      classes: ['S1', 'S2', 'S3', 'S4', 'S5'] // Physics for higher classes, Science for S1
    },
    { 
      id: 4, 
      name: 'Mrs. Davis', 
      subjects: ['Chemistry'], 
      classes: ['S2', 'S3', 'S4', 'S5'] // Chemistry not taught in S1
    },
    { 
      id: 5, 
      name: 'Dr. Wilson', 
      subjects: ['Biology'], 
      classes: ['S2'] // Only teaches Biology in S2
    },
    { 
      id: 6, 
      name: 'Ms. Anderson', 
      subjects: ['Social Studies', 'Economics'], 
      classes: ['S1', 'S4'] // Social Studies in S1, Economics in S4
    },
    { 
      id: 7, 
      name: 'Mr. Taylor', 
      subjects: ['Computer Science'], 
      classes: ['S3'] // Only teaches Computer Science in S3
    },
    { 
      id: 8, 
      name: 'Mrs. Lee', 
      subjects: ['Malayalam'], 
      classes: ['S1'] // Local language for S1
    },
    { 
      id: 9, 
      name: 'Dr. Kumar', 
      subjects: ['Business Studies'], 
      classes: ['S5'] // Business Studies only in S5
    }
  ]