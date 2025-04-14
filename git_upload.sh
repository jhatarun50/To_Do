# Initialize git repository (if not already done)
git init

# Add all files in the directory
git add .

# Commit the files
git commit -m "Initial commit"

# Add GitHub repository as remote (replace USERNAME/todo with your GitHub username and repository name)
git remote add origin https://github.com/jhatarun50/To_Do.git

# Push to GitHub
git push -u origin main
