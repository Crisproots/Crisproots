import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Save the image temporarily
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const tempDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tempDir, { recursive: true });
    const tempImagePath = path.join(tempDir, imageFile.name);
    await fs.writeFile(tempImagePath, buffer);

    // Path to the Python script
    const pythonScriptPath = path.join(process.cwd(), 'src', 'plantdiseaseprediction', 'app', 'main.py');

    // Execute the Python script
    // Note: This assumes 'python' command is available in the environment's PATH
    // and all Python dependencies are installed.
    // Use 'cmd.exe /c' for robust command execution on Windows, and set TF_CPP_MIN_LOG_LEVEL to suppress TensorFlow logs.
    const command = `set TF_CPP_MIN_LOG_LEVEL=3 && python "${pythonScriptPath}" "${tempImagePath}"`;

    return new Promise<NextResponse>((resolve) => {
      exec(command, { shell: 'cmd.exe' }, async (error, stdout, stderr) => {
        // Clean up the temporary image file
        await fs.unlink(tempImagePath);

        if (error) {
          console.error(`exec error: ${error}`);
          console.error(`Python script stderr: ${stderr}`);
          console.error(`Python script stdout: ${stdout}`);
          return resolve(NextResponse.json({ error: 'Prediction failed', details: stderr, stdout: stdout }, { status: 500 }));
        }
        try {
          // Extract JSON from stdout (in case of extra output from Python script)
          const jsonStartIndex = stdout.indexOf('{');
          const jsonEndIndex = stdout.lastIndexOf('}');
          let jsonString = stdout;

          if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
            jsonString = stdout.substring(jsonStartIndex, jsonEndIndex + 1);
          }

          // Parse the JSON output from the Python script
          const result = JSON.parse(jsonString);
          resolve(NextResponse.json({ prediction: result.prediction }, { status: 200 }));
        } catch (parseError) {
          console.error('Failed to parse prediction output:', parseError);
          console.error('Raw stdout:', stdout);
          resolve(NextResponse.json({ error: 'Failed to parse prediction output', raw: stdout, parseError: parseError.message }, { status: 500 }));
        }
      });
    });

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}