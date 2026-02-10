import { spawn } from 'child_process';

export interface SkillExecutionResult {
  success: boolean;
  output: string;
  error?: string;
}

export async function executeLast30DaysSkill(prompt: string): Promise<SkillExecutionResult> {
  return new Promise((resolve) => {
    // Execute the claude skill command
    const process = spawn('claude', ['skill', 'last30days', prompt], {
      shell: true,
    });

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Set timeout
    const timeout = setTimeout(() => {
      process.kill();
      resolve({
        success: false,
        output: '',
        error: 'Command timed out after 60 seconds',
      });
    }, 60000);

    process.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve({
          success: true,
          output: output.trim(),
        });
      } else {
        resolve({
          success: false,
          output: output,
          error: errorOutput || `Command exited with code ${code}`,
        });
      }
    });

    process.on('error', (err) => {
      clearTimeout(timeout);
      resolve({
        success: false,
        output: '',
        error: `Failed to execute command: ${err.message}`,
      });
    });
  });
}
