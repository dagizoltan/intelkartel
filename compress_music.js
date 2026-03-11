const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const originalDir = path.join(__dirname, 'data', 'music-original');
const targetDir = path.join(__dirname, 'data', 'music');

function compressMusic() {
    console.log('Starting music compression...');

    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Check if original directory exists
    if (!fs.existsSync(originalDir)) {
        console.error(`Error: Original directory ${originalDir} not found.`);
        return;
    }

    // Read all files in the original directory
    fs.readdir(originalDir, (err, files) => {
        if (err) {
            console.error('Error reading original directory:', err);
            return;
        }

        const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');

        if (mp3Files.length === 0) {
            console.log('No .mp3 files found to compress.');
            return;
        }

        let compressedCount = 0;
        let processedCount = 0;

        mp3Files.forEach(file => {
            const originalPath = path.join(originalDir, file);
            const targetPath = path.join(targetDir, file);

            console.log(`Compressing: ${file}`);

            // Use ffmpeg to compress the mp3 (e.g., 64kbps)
            const ffmpegArgs = ['-y', '-i', originalPath, '-codec:a', 'libmp3lame', '-b:a', '64k', targetPath];

            const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

            ffmpegProcess.on('close', (code) => {
                processedCount++;
                if (code !== 0) {
                    console.error(`Error compressing ${file}: ffmpeg exited with code ${code}`);
                } else {
                    compressedCount++;
                    console.log(`Successfully compressed ${file}`);
                }

                if (processedCount === mp3Files.length) {
                    console.log(`\nFinished compressing ${compressedCount} out of ${mp3Files.length} audio files.`);
                }
            });

            ffmpegProcess.on('error', (err) => {
                console.error(`Failed to start subprocess for ${file}:`, err);
            });
        });
    });
}

compressMusic();
