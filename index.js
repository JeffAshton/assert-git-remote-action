const child_process = require( 'child_process' );
const core = require('@actions/core' );
const { EOL } = require( 'os' );
const util = require( 'util' );

const execFile = util.promisify(child_process.execFile);

function writeProcessOutput( output ) {

	const stderr = output.stderr;
	if( stderr ) {
		core.info( stderr );
	}

	const stdout = output.stdout;
	if( stdout ) {
		core.info( stdout );
	}
}

async function gitFetch( remote, ref ) {

	console.info( `> git fetch --verbose ${remote} ${ref}` );

	const output = await execFile( 'git', [
		'fetch',
		'--verbose',
		remote,
		ref
	] );

	writeProcessOutput( output );
}

async function gitShowRef( ref ) {

	console.info( `> git show-ref --hash --verify ${ref}` );
	
	const output = await execFile( 'git', [ 
		'show-ref',
		'--hash',
		'--verify',
		ref
	] );

	writeProcessOutput( output );

	const hash = output.stdout;
	if( !hash ) {
		throw new Error( 'git show-ref did not return a hash.' );
	}

	return hash;
}

async function run() {
	try {
		const remote = core.getInput( 'remote' );
		const ref = core.getInput( 'ref' );
		
		const localRef = 'HEAD';
		const remoteRef = `refs/remotes/${remote}/${ref}`;

		await gitFetch( remote, ref );

		const localHash = await gitShowRef( localRef );
		const remoteHash = await gitShowRef( remoteRef );

		if( localHash === remoteHash ) {
			core.info( `${localRef} == ${remoteRef}` )
			core.setOutput( 'result', 'same' );

		} else {
			core.setFailed( `${localRef} != ${remoteRef}` )
			core.setOutput( 'result', 'different' );
		}

	} catch( error ) {

		writeProcessOutput( error );

		core.setFailed( error.message );
	}
}

run();
