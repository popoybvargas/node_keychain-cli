const crypto = require( 'crypto' );
const fs = require( 'fs' );

require( 'zv-load.env' )();

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes( 32 );
const iv = crypto.randomBytes( 16 );

const getKeychain = () =>
{
	if ( ! process.env.KEYCHAIN_PATH )
	{
		console.log( 'ERROR 💥 Please provide a KEYCHAIN_PATH!' );

		return process.exit( 1 );
	}

	if ( ! fs.existsSync( process.env.KEYCHAIN_PATH ) )
	{
		console.log( `ERROR 💥 Your ${process.env.KEYCHAIN_PATH} keychain file does not exist!` );

		return process.exit( 1 );
	}

	const keychain = fs.readFileSync( process.env.KEYCHAIN_PATH, 'utf-8' );
	const keychainObj = keychain ? JSON.parse( keychain ) : [];

	return keychainObj;
};

const encrypt = ( name, textToEncrypt, account ) =>
{
	try
	{
		const keychainObj = getKeychain();

		if ( keychainObj.find( el => el.name === name ) )
		{
			return console.log( `ERROR 💥 <${name}> is already in the keychain!` );
		}

		const cipher = crypto.createCipheriv( algorithm, Buffer.from( key ), iv );
		let encrypted = cipher.update( textToEncrypt );
		encrypted = Buffer.concat( [ encrypted, cipher.final() ] );
		
		const encryptedObj = { name, key, iv: iv.toString( 'hex' ), encryptedData: encrypted.toString( 'hex' ), account };

		keychainObj.push( encryptedObj );

		fs.writeFileSync( process.env.KEYCHAIN_PATH, JSON.stringify( keychainObj ) );

		console.log( 'Successfully encrypted.' );

		return encryptedObj;
	}
	catch ( err ) { console.log( err ) };
};

const decrypt = name =>
{
	try
	{
		const keychain = fs.readFileSync( process.env.KEYCHAIN_PATH, 'utf-8' );

		if ( keychain )
		{
			const keychainObj = JSON.parse( keychain );
			const targetKey = keychainObj.find( el => el.name === name );

			if ( targetKey )
			{
				const key = Buffer.from( targetKey.key );
				const iv = Buffer.from( targetKey.iv, 'hex' );
				const encryptedText = Buffer.from( targetKey.encryptedData, 'hex' );
				let decipher = crypto.createDecipheriv( algorithm, key, iv );
				let decrypted = decipher.update( encryptedText );
				decrypted = Buffer.concat( [ decrypted, decipher.final() ] );

				console.log( `${targetKey.account} | ${decrypted.toString()}` );

				return decrypted.toString();
			}
			else
			{
				console.log( `ERROR 💥 <${name}> does not exist in the keychain!` );
			}
		}
		else
		{
			console.log( '⚠️ Your keychain is empty. Start encrypting first.' );
		}
	}
	catch ( err ) { console.log( err ); }
};

const getNames = ( name = null ) =>
{
	const keychainObj = getKeychain();
	let keychainNames = [];

	if ( name )
	{
		keychainObj.filter( el =>
		{
			if ( el.name.includes( name ) )
			{
				keychainNames.push( el.name );
			}
		});
	}
	else
	{
		keychainNames = keychainObj.map( el => el.name );
	}
	const result = ( keychainNames.length > 3 ) ? { total: keychainNames.length, names: keychainNames } : keychainNames;

	console.log( result );
};

( () =>
{
	const action = process.argv[ 2 ];
	const name = process.argv[ 3 ];
	const textToEncrypt = process.argv[ 4 ];
	const account = process.argv[ 5 ];
	
	if ( action === '--encrypt' && name && textToEncrypt )
	{
		encrypt( name, textToEncrypt, account );
	}
	else if ( action === '--decrypt' && name )
	{
		decrypt( name );
	}
	else if ( action === '--getNames' && name )
	{
		getNames( name );
	}
	else if ( action === '--getNames' )
	{
		getNames();
	}
	else
	{
		console.log( 'ERROR 💥 Invalid action!' );
	}
})();