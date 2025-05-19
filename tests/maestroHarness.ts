import {spawn, spawnSync, ChildProcess} from 'child_process';

let emulatorProc: ChildProcess | undefined;
let androidProc: ChildProcess | undefined;
let maestroProc: ChildProcess | undefined;
// let metroProc: ChildProcess | undefined;

function killAll() {
  if (maestroProc && !maestroProc.killed) maestroProc.kill();
  if (androidProc && !androidProc.killed) androidProc.kill();
  if (emulatorProc && !emulatorProc.killed) emulatorProc.kill();
  // if (metroProc && !metroProc.killed) metroProc.kill();
}

// process.on("SIGINT", () => {
//   killAll();
//   process.exit(1);
// });
// process.on("exit", killAll);
function maestroMagic() {
  const args = ['start-device', '--platform=android'];
  const result = spawnSync('maestro', args);
  if (result.error) {
    console.error('Error starting Maestro device:', result.error);
    process.exit(1);
  } else {
    console.log('Maestro device started successfully');
  }

  // const result2 = spawnSync('emulator', ['-list-avds']);
  // console.log('res:', result2.stdout.toString());

  // emulatorProc = spawn('maestro', args, {
  //   shell: true,
  //   stdio: 'inherit',
  //   detached: true,
  // });
}

// function spawnEmulator() {
//   const isCI = process.env.CI === 'true';
//   const args = ['-avd', '$(emulator -list-avds | head -n 1)'];

//   if (isCI) {
//     args.push('-no-window');
//   }

//   emulatorProc = spawn('emulator', args, {
//     shell: true,
//     stdio: 'inherit',
//     detached: true,
//   });
// }

async function waitForDeviceBoot() {
  // Wait until device is recognized
  spawnSync('adb', ['wait-for-device'], {stdio: 'inherit'});
  // Poll for sys.boot_completed
  while (true) {
    const result = spawnSync('adb', ['shell', 'getprop', 'sys.boot_completed']);
    if (result.stdout.toString().trim() === '1') break;
    await new Promise(res => setTimeout(res, 1000));
  }
}

// async function startMetro() {
//   return new Promise<void>((resolve, reject) => {
//     let isResolved = false;
//     metroProc = spawn('bun', ['start'], {
//       stdio: ['pipe', 'pipe', 'inherit'],
//     });

//     // Handle pipe errors
//     metroProc.stdin?.on('error', err => {
//       if (err.code === 'EPIPE') {
//         console.warn('Metro stdin pipe was broken, this is usually not critical');
//       } else {
//         console.error('Metro stdin error:', err);
//       }
//     });

//     metroProc.stdout?.on('data', (data: Buffer) => {
//       const text = data.toString();
//       console.log(text);
//       if (text.includes('Welcome to Metro') && !isResolved) {
//         isResolved = true;
//         resolve();
//       }
//     });

//     metroProc.on('exit', (code: number | null) => {
//       if (!isResolved) {
//         if (code !== 0 && code !== null) {
//           reject(new Error(`Metro failed with code ${code}`));
//         } else {
//           resolve();
//         }
//       }
//     });
//   });
// }

async function buildAndroid() {
  return new Promise<void>((resolve, reject) => {
    let isResolved = false;
    androidProc = spawn('bun', ['android'], {
      stdio: ['pipe', 'pipe', 'inherit'],
    });

    // Handle pipe errors
    androidProc.stdin?.on('error', err => {
      if (err.code === 'EPIPE') {
        console.warn('Android build stdin pipe was broken, this is usually not critical');
      } else {
        console.error('Android build stdin error:', err);
      }
    });

    androidProc.stdout?.on('error', err => {
      if (err.code === 'EPIPE') {
        console.warn('Android build stdout pipe was broken, this is usually not critical');
      } else {
        console.error('Android build stdout error:', err);
      }
    });

    androidProc.stdout?.on('data', (data: Buffer) => {
      const text = data.toString();
      if (text.includes('Android Bundled') && !isResolved) {
        isResolved = true;
        resolve();
      }
    });

    androidProc.on('exit', (code: number | null) => {
      if (!isResolved) {
        if (code !== 0 && code !== null) {
          reject(new Error(`Expo failed with code ${code}`));
        } else {
          resolve();
        }
      }
    });
  });
}

function spawnMaestroTest() {
  return new Promise<void>((resolve, reject) => {
    maestroProc = spawn('maestro', ['test', './tests/maestro'], {stdio: 'inherit'});
    maestroProc.on('exit', (code: number | null) => {
      if (code !== 0 && code !== null) {
        reject(new Error(`Maestro test failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function main() {
  process.on('SIGINT', () => {
    killAll();
    process.exit(1);
  });

  // spawnEmulator();

  // await waitForDeviceBoot();
  maestroMagic();

  try {
    await buildAndroid();
    await spawnMaestroTest();
    // Add any other steps that should run after Android build
  } catch (err) {
    console.error('Error during build:', err);
  } finally {
    killAll();
    process.exit(0);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
