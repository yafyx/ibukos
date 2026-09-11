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
import { cn } from "@ibukos/ui/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const chromeButtonClass =
	"h-11 px-4 text-sm lg:h-8 lg:px-2.5 lg:text-xs";

export default function UserMenu({ className }: { className?: string }) {
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();

	if (!session) {
		return (
			<Button
				className={cn(chromeButtonClass, className)}
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
			<MenuTrigger
				render={
					<Button
						className={cn(chromeButtonClass, className)}
						variant="outline"
					/>
				}
			>
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
