import { Button } from "@ibukos/ui/components/button";
import {
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from "@ibukos/ui/components/menu";
import { Link, useNavigate } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();

	if (!session) {
		return (
			<Button
				nativeButton={false}
				render={<Link to="/login" />}
				variant="outline"
			>
				Masuk
			</Button>
		);
	}

	return (
		<Menu>
			<MenuTrigger render={<Button variant="outline" />}>
				{session.user.name}
			</MenuTrigger>
			<MenuPopup align="end">
				<MenuGroup>
					<MenuGroupLabel>Akun</MenuGroupLabel>
					<MenuItem disabled>{session.user.email}</MenuItem>
					<MenuSeparator />
					<MenuItem
						onClick={() => {
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										navigate({ to: "/" });
									},
								},
							});
						}}
						variant="destructive"
					>
						Keluar
					</MenuItem>
				</MenuGroup>
			</MenuPopup>
		</Menu>
	);
}
