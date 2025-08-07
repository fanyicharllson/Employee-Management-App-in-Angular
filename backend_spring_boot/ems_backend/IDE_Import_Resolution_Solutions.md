# Solutions for "Cannot resolve symbol 'ApiResponse'" Error

Since the build is successful but the IDE is showing an import error for ApiResponse, this is likely an IDE-specific issue rather than an actual compilation problem. Here are solutions to resolve the error:

## 1. Refresh/Reload the project in your IDE
- In IntelliJ IDEA: Right-click on the project → "Maven" → "Reload Project"
- In Eclipse: Right-click on the project → "Maven" → "Update Project"

## 2. Invalidate caches and restart
- In IntelliJ IDEA: File → Invalidate Caches / Restart
- This clears IDE caches that might be causing incorrect error highlighting

## 3. Rebuild the project
- In IntelliJ IDEA: Build → Rebuild Project
- In Eclipse: Project → Clean

## 4. Check module dependencies
- Ensure the module containing ApiResponse is properly included in your project dependencies

## 5. Verify import statement
- The import statement `import com.charllson.ems_backend.exceptions.ApiResponse;` is correct based on the file location

The code itself is correct, as evidenced by the successful build. This is just an IDE issue with resolving symbols, which should be fixed by one of the above solutions.