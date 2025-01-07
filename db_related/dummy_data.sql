-- First, insert admin user (password is 'admin123' hashed with bcrypt)
INSERT INTO users (id, username, email, password) 
VALUES (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'admin',
    'admin@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfWxHrR/jQh/zTC'  -- 'admin123' hashed
);

-- Then insert all categories
INSERT INTO categories (id, name) VALUES
    ('c1b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3b', 'Technology'),
    ('c2b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3c', 'Travel'),
    ('c3b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3d', 'Food'),
    ('c4b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3e', 'Lifestyle'),
    ('c5b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3f', 'Programming');

-- Then insert all posts
INSERT INTO posts (id, title, content) VALUES
    ('p1b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3b', 'Getting Started with React', 
     'React is a powerful JavaScript library for building user interfaces. In this post, we''ll explore the basics of React and how to create your first component...'),
    
    ('p2b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3c', 'My Trip to Japan', 
     'Last month, I had the amazing opportunity to visit Japan. From the bustling streets of Tokyo to the serene temples of Kyoto...'),
    
    ('p3b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3d', 'Best Ramen Spots in the City', 
     'As a ramen enthusiast, I''ve tried countless bowls across the city. Here are my top picks for the most authentic and delicious ramen...'),
    
    ('p4b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3e', 'Working Remotely: A Year in Review', 
     'After a full year of working remotely, I''ve learned valuable lessons about productivity, work-life balance, and maintaining professional relationships...'),
    
    ('p5b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3f', 'Understanding TypeScript', 
     'TypeScript has become increasingly popular in the web development world. Let''s dive into why you might want to use TypeScript in your next project...');

-- Finally, connect posts with categories
INSERT INTO posts_categories (id, p_id, c_id) VALUES
    ('pc1b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3b', 'p1b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3b', 'c1b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3b'),
    ('pc2b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3c', 'p1b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3b', 'c5b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3f'),
    ('pc3b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3d', 'p2b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3c', 'c2b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3c'),
    ('pc4b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3e', 'p3b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3d', 'c3b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3d'),
    ('pc5b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3f', 'p4b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3e', 'c4b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3e'),
    ('pc6b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3g', 'p5b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3f', 'c1b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3b'),
    ('pc7b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3h', 'p5b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3f', 'c5b6c3d4-3d3c-4c3b-b3c3-3c3b3c3b3c3f');