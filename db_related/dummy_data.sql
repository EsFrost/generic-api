-- First, insert admin user (password is 'admin123' hashed with bcrypt)
INSERT INTO users (id, username, email, password) 
VALUES (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'admin',
    'admin@example.com',
    '$2b$10$KYChom.axPybSUOGCw9IieLrE5MqCGX1UCbKyF6Rf1V1YpPz4sNe.'  -- 'admin123' hashed
);

-- Then insert all categories
INSERT INTO categories (id, name) VALUES
    ('d24944c7-9d71-4451-a143-93834b0297aa', 'Technology'),
    ('c2e726d2-536f-48c7-9983-789aa23a6d68', 'Travel'),
    ('b5e8f342-e8c0-4741-b675-44c44c1056b7', 'Food'),
    ('a3d8c6b1-7c42-4612-a5c8-c3757a75c7d0', 'Lifestyle'),
    ('9f5b8e3a-6d14-4583-b3d4-b9a12e5c1c2d', 'Programming');

-- Then insert all posts
INSERT INTO posts (id, title, content, image_url) VALUES
    ('8b72e3fa-9c6d-4c21-b549-b3c9c3b2a8d1', 
     'Getting Started with React', 
     'React is a powerful JavaScript library for building user interfaces. In this post, we''ll explore the basics of React and how to create your first component. 
     
     React''s component-based architecture makes it easy to build reusable UI elements. We''ll cover key concepts like JSX, props, and state management.
     
     By the end of this tutorial, you''ll have a solid foundation in React development and be ready to build your own applications.',
     'https://example.com/images/react-basics.jpg'),
    
    ('7e4f2d1c-5b3a-4c18-9e27-a8b6c5d4e3f2', 
     'My Trip to Japan', 
     'Last month, I had the amazing opportunity to visit Japan. From the bustling streets of Tokyo to the serene temples of Kyoto, every moment was unforgettable.
     
     The blend of traditional culture and modern technology creates a unique atmosphere that''s hard to find anywhere else in the world.
     
     This post details my two-week journey, including must-visit locations, cultural insights, and practical travel tips for anyone planning their own Japanese adventure.',
     'https://example.com/images/japan-trip.jpg'),
    
    ('6d3e1c2b-4a29-4b17-8d16-97a5b4c2d1e0', 
     'Best Ramen Spots in the City', 
     'As a ramen enthusiast, I''ve tried countless bowls across the city. Here are my top picks for the most authentic and delicious ramen.
     
     From rich tonkotsu broths to light and refreshing shoyu bases, each spot offers something unique.
     
     I''ll share detailed reviews of each location, including specialty dishes, pricing, and the best times to visit to avoid the crowds.',
     'https://example.com/images/ramen-guide.jpg'),
    
    ('5c2d0b1a-3918-4a16-7c15-86b4a3c1d0e9', 
     'Working Remotely: A Year in Review', 
     'After a full year of working remotely, I''ve learned valuable lessons about productivity, work-life balance, and maintaining professional relationships.
     
     This post covers the challenges and benefits of remote work, including practical tips for setting up your home office, managing your time effectively, and staying connected with your team.
     
     I''ll also share the tools and techniques that helped me stay productive and motivated throughout the year.',
     'https://example.com/images/remote-work.jpg'),
    
    ('4b1c9a09-2807-3a15-6b14-75a3b2c0d9e8', 
     'Understanding TypeScript', 
     'TypeScript has become increasingly popular in the web development world. Let''s dive into why you might want to use TypeScript in your next project.
     
     We''ll explore key features like static typing, interfaces, and generics, with practical examples showing how TypeScript can improve code quality and developer experience.
     
     By the end of this guide, you''ll understand the benefits of TypeScript and how to start implementing it in your projects.',
     'https://example.com/images/typescript-guide.jpg');

-- Finally, connect posts with categories (using the new IDs from above)
INSERT INTO posts_categories (id, p_id, c_id) VALUES
    ('3a0b8f98-1706-2914-5a13-64a2b1c8d7e7', '8b72e3fa-9c6d-4c21-b549-b3c9c3b2a8d1', 'd24944c7-9d71-4451-a143-93834b0297aa'),
    ('290a7e87-0605-1813-4912-53a1a0b7c6e6', '8b72e3fa-9c6d-4c21-b549-b3c9c3b2a8d1', '9f5b8e3a-6d14-4583-b3d4-b9a12e5c1c2d'),
    ('1809d876-9504-0712-3811-42a0b9a6c5d5', '7e4f2d1c-5b3a-4c18-9e27-a8b6c5d4e3f2', 'c2e726d2-536f-48c7-9983-789aa23a6d68'),
    ('0708c765-8403-9611-2710-3190a8b5c4d4', '6d3e1c2b-4a29-4b17-8d16-97a5b4c2d1e0', 'b5e8f342-e8c0-4741-b675-44c44c1056b7'),
    ('9607b654-7302-8510-1699-2089b7a4b3c3', '5c2d0b1a-3918-4a16-7c15-86b4a3c1d0e9', 'a3d8c6b1-7c42-4612-a5c8-c3757a75c7d0'),
    ('8506a543-6201-7499-0588-1988a6b3a2b2', '4b1c9a09-2807-3a15-6b14-75a3b2c0d9e8', 'd24944c7-9d71-4451-a143-93834b0297aa'),
    ('7405b432-5190-6388-9477-0877b5a2b1a1', '4b1c9a09-2807-3a15-6b14-75a3b2c0d9e8', '9f5b8e3a-6d14-4583-b3d4-b9a12e5c1c2d');