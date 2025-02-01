-- First, insert admin user (password is 'admin123' hashed with bcrypt)
INSERT INTO users (id, username, email, password) 
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin',
    'admin@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfWxHrR/jQh/zTC'  -- 'admin123' hashed
);

-- Then insert all categories
INSERT INTO categories (id, name) VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Technology'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Travel'),
    ('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Food'),
    ('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Lifestyle'),
    ('b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Programming');

-- Then insert all posts
INSERT INTO posts (id, title, content, image_url) VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
     'Getting Started with React', 
     'React is a powerful JavaScript library for building user interfaces. In this post, we''ll explore the basics of React and how to create your first component. 
     
     React''s component-based architecture makes it easy to build reusable UI elements. We''ll cover key concepts like JSX, props, and state management.
     
     By the end of this tutorial, you''ll have a solid foundation in React development and be ready to build your own applications.',
     'https://example.com/images/react-basics.jpg'),
    
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
     'My Trip to Japan', 
     'Last month, I had the amazing opportunity to visit Japan. From the bustling streets of Tokyo to the serene temples of Kyoto, every moment was unforgettable.
     
     The blend of traditional culture and modern technology creates a unique atmosphere that''s hard to find anywhere else in the world.
     
     This post details my two-week journey, including must-visit locations, cultural insights, and practical travel tips for anyone planning their own Japanese adventure.',
     'https://example.com/images/japan-trip.jpg'),
    
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
     'Best Ramen Spots in the City', 
     'As a ramen enthusiast, I''ve tried countless bowls across the city. Here are my top picks for the most authentic and delicious ramen.
     
     From rich tonkotsu broths to light and refreshing shoyu bases, each spot offers something unique.
     
     I''ll share detailed reviews of each location, including specialty dishes, pricing, and the best times to visit to avoid the crowds.',
     'https://example.com/images/ramen-guide.jpg'),
    
    ('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
     'Working Remotely: A Year in Review', 
     'After a full year of working remotely, I''ve learned valuable lessons about productivity, work-life balance, and maintaining professional relationships.
     
     This post covers the challenges and benefits of remote work, including practical tips for setting up your home office, managing your time effectively, and staying connected with your team.
     
     I''ll also share the tools and techniques that helped me stay productive and motivated throughout the year.',
     'https://example.com/images/remote-work.jpg'),
    
    ('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
     'Understanding TypeScript', 
     'TypeScript has become increasingly popular in the web development world. Let''s dive into why you might want to use TypeScript in your next project.
     
     We''ll explore key features like static typing, interfaces, and generics, with practical examples showing how TypeScript can improve code quality and developer experience.
     
     By the end of this guide, you''ll understand the benefits of TypeScript and how to start implementing it in your projects.',
     'https://example.com/images/typescript-guide.jpg');

-- Finally, connect posts with categories
INSERT INTO posts_categories (id, p_id, c_id) VALUES
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');