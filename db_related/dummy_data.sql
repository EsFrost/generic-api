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
INSERT INTO posts (id, title, content) VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Getting Started with React', 
     'React is a powerful JavaScript library for building user interfaces. In this post, we''ll explore the basics of React and how to create your first component...'),
    
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'My Trip to Japan', 
     'Last month, I had the amazing opportunity to visit Japan. From the bustling streets of Tokyo to the serene temples of Kyoto...'),
    
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Best Ramen Spots in the City', 
     'As a ramen enthusiast, I''ve tried countless bowls across the city. Here are my top picks for the most authentic and delicious ramen...'),
    
    ('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Working Remotely: A Year in Review', 
     'After a full year of working remotely, I''ve learned valuable lessons about productivity, work-life balance, and maintaining professional relationships...'),
    
    ('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Understanding TypeScript', 
     'TypeScript has become increasingly popular in the web development world. Let''s dive into why you might want to use TypeScript in your next project...');

-- Finally, connect posts with categories
INSERT INTO posts_categories (id, p_id, c_id) VALUES
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');