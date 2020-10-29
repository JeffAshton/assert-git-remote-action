const child_process = require( 'child_process' );
const core = require('@actions/core' );
const { EOL } = require( 'os' );
const util = require( 'util' );
const { write } = require( 'fs' );

const execFile = util.promisify(child_process.execFile);

async function gitFetch( remote, ref ) {

	console.info( `> git fetch --verbose ${remote} ${ref}` );

	const { stdout, stderr } = await execFile( 'git', [
		'fetch',
		'--verbose',
		remote,
		ref
	] );

	if( stdout ) {
		process.stdout.write( `${stdout}${EOL}` );
	}

	if( stderr ) {
		process.stderr.write( `${stderr}${EOL}` );
	}
}

async function gitShowRef( ref ) {

	console.info( `> git show-ref --hash --verify ${ref}` );
	
	const { stdout, stderr } = await execFile( 'git', [ 
		'show-ref',
		'--hash',
		'--verify',
		ref
	] );

	if( stderr ) {
		process.stderr.write( `${stderr}${EOL}` );
	}

	const hash = stdout;
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
		core.info( `${localHash}` );

		const remoteHash = await gitShowRef( remoteRef );
		core.info( `${remoteHash}` );

		if( localHash === remoteHash ) {
			core.info( `${localRef} == ${remoteRef}` )

		} else {
			core.setFailed( `${localRef} != ${remoteRef}` )
		}

	} catch( error ) {

		if( error.stdout ) {
			process.stdout.write( `${error.stdout}${EOL}` );
		}

		if( error.stderr ) {
			process.stderr.write( `${error.stderr}${EOL}` );
		}

		core.setFailed( error.message );
	}
}

run();
