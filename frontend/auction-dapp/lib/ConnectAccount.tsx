import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSuiClientQuery } from '@mysten/dapp-kit';

function ConnectedAccount() {
	const account = useCurrentAccount();

	if (!account) {
		return null;
	}
    return (
		<div>
			<div>Connected to {account.address}</div>
			<OwnedObjects address={account.address} />
		</div>
	);
}

function OwnedObjects({ address }: { address: string }) {
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: address,
	});
	if (!data) {
		return null;
	}

	return (
		<ul>
			{data.data.map((object) => (
				<li key={object.data?.objectId}>
					<a href={`https://example-explorer.com/object/${object.data?.objectId}`}>
						{object.data?.objectId}
					</a>
				</li>
			))}
		</ul>
	);
}

export default ConnectedAccount;