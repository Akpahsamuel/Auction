# Passkey Authentication Implementation

This document describes the passkey authentication implementation for the Sui Auction DApp using the Sui TypeScript SDK.

## Overview

Passkey authentication provides a secure, passwordless authentication method using WebAuthn standards. Users can authenticate using biometrics (fingerprint, face ID) or hardware security keys. **Passkey is now integrated as a wallet connection method alongside the traditional "Connect Wallet" button.**

## Features

- ✅ Create new passkey wallets
- ✅ Recover existing passkey wallets
- ✅ Sign transactions with passkey
- ✅ Sign personal messages with passkey
- ✅ Cross-platform support
- ✅ Phishing-resistant authentication
- ✅ Integrated wallet connection flow

## Implementation Details

### Components

1. **PasskeyConnectButton Component** (`src/components/PasskeyConnectButton.tsx`)
   - Handles passkey creation and recovery
   - Integrates with the wallet connection flow
   - Shows connected state with address display
   - Provides disconnect functionality

2. **usePasskeyAuth Hook** (`src/hooks/usePasskeyAuth.ts`)
   - Manages passkey authentication state
   - Provides transaction and message signing functions
   - Handles connection and disconnection
   - Manages address storage and retrieval

3. **usePasskeyAuction Hook** (`src/hooks/usePasskeyAuction.ts`)
   - Integrates passkey authentication with auction functionality
   - Provides passkey-authenticated auction operations

4. **PasskeyInfo Component** (`src/components/PasskeyInfo.tsx`)
   - Educational popup to inform users about passkey authentication
   - Shows benefits of passkey authentication
   - Dismissible information panel

5. **Navigation Integration** (`src/components/Navigation.tsx`)
   - PasskeyConnectButton integrated into the navigation bar
   - Available on both desktop and mobile views
   - Positioned alongside the traditional ConnectButton

### Key Features

#### Creating a New Passkey

```typescript
const { connect } = usePasskeyAuth();
const address = await connect('create');
```

#### Recovering an Existing Passkey

```typescript
const { connect } = usePasskeyAuth();
const address = await connect('recover');
```

#### Signing Transactions

```typescript
const { signTransaction } = usePasskeyAuth();
const signature = await signTransaction(txBytes);
```

#### Signing Personal Messages

```typescript
const { signPersonalMessage } = usePasskeyAuth();
const message = new TextEncoder().encode('Hello world!');
const { signature } = await signPersonalMessage(message);
```

## User Experience

### Connection Flow

1. **Desktop**: Users see "Create Passkey" and "Recover Passkey" buttons in the navigation bar
2. **Mobile**: Passkey options are available in the mobile menu
3. **Connected State**: Shows the connected address with a disconnect option
4. **Info Panel**: Educational popup explains passkey benefits

### Integration Points

- **Navigation Bar**: PasskeyConnectButton positioned next to ConnectButton
- **Mobile Menu**: Passkey options in the mobile navigation
- **Info Panel**: Educational component to promote passkey usage
- **Storage**: Address persistence using localStorage

## Browser Support

### Supported Browsers
- Chrome 67+
- Firefox 60+
- Safari 13+
- Edge 18+

### Supported Devices
- Touch ID (iPhone, iPad, Mac)
- Face ID (iPhone, iPad)
- Windows Hello
- Hardware security keys (YubiKey, etc.)

## Security Features

1. **Phishing Resistance**: Passkeys are bound to specific domains
2. **No Shared Secrets**: Each passkey is unique and cannot be reused
3. **Biometric Protection**: Uses device biometrics for authentication
4. **Cross-Platform**: Works across multiple devices and platforms

## Usage

### Basic Authentication

```typescript
import { usePasskeyAuth } from './hooks/usePasskeyAuth';

const { isAuthenticated, address, connect, disconnect, signTransaction } = usePasskeyAuth();
```

### Auction Integration

```typescript
import { usePasskeyAuction } from './hooks/usePasskeyAuction';

const { 
  isAuthenticated, 
  placeBidWithPasskey, 
  claimNftWithPasskey 
} = usePasskeyAuction();
```

## Configuration

### Relying Party Configuration

The passkey implementation uses the following configuration:

```typescript
{
  rpName: 'Sui Auction Passkey',
  rpId: window.location.hostname,
  authenticatorSelection: {
    authenticatorAttachment: 'cross-platform',
  },
}
```

- `rpName`: Human-readable name for the relying party
- `rpId`: Domain identifier (usually the current hostname)
- `authenticatorAttachment`: Type of authenticator to use

## Error Handling

The implementation includes comprehensive error handling for:

- Browser compatibility issues
- User cancellation of authentication
- Network errors
- Invalid passkey operations

## Storage

Passkey addresses are stored in localStorage for session persistence. In a production environment, consider using more secure storage methods.

## Future Enhancements

1. **Multi-device Sync**: Implement passkey synchronization across devices
2. **Backup Recovery**: Add backup and recovery mechanisms
3. **Advanced Security**: Implement additional security measures
4. **Transaction Integration**: Full integration with Sui transaction building
5. **Wallet Integration**: Deeper integration with existing wallet systems

## Testing

To test the passkey implementation:

1. Look for the passkey buttons in the navigation bar
2. Click "Create Passkey" to create a new passkey wallet
3. Test recovery by clicking "Recover Passkey"
4. Verify the connected state shows your address
5. Test disconnect functionality

## Troubleshooting

### Common Issues

1. **Browser Not Supported**: Ensure you're using a supported browser version
2. **No Biometric Hardware**: Some devices may not support biometric authentication
3. **User Cancellation**: Users can cancel the authentication process
4. **Network Issues**: Ensure stable internet connection for passkey operations

### Debug Information

Enable browser developer tools to see detailed error messages and debug information for passkey operations.

## References

- [Sui TypeScript SDK Passkey Documentation](https://sdk.mystenlabs.com/typescript/cryptography/passkey)
- [WebAuthn Specification](https://www.w3.org/TR/webauthn/)
- [Passkeys.dev](https://passkeys.dev/) - Device compatibility information

## License

This implementation follows the same license as the main project. 