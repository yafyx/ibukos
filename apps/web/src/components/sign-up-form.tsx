import { Button } from "@ibukos/ui/components/button";
import { Input } from "@ibukos/ui/components/input";
import { Label } from "@ibukos/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const navigate = useNavigate({
		from: "/",
	});
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onSuccess: () => {
						navigate({
							to: "/dashboard",
						});
						toast.success("Akun berhasil dibuat");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Nama minimal 2 karakter"),
				email: z.email("Alamat email tidak valid"),
				password: z.string().min(8, "Kata sandi minimal 8 karakter"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="mx-auto flex w-full max-w-md flex-col gap-6">
			<h1 className="text-pretty text-center font-heading font-semibold text-3xl tracking-tight">
				Buat akun
			</h1>

			<form
				className="flex flex-col gap-4"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field name="name">
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name}>Nama</Label>
							<Input
								aria-invalid={field.state.meta.errors.length > 0}
								autoComplete="name"
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
								value={field.state.value}
							/>
							{field.state.meta.errors.map((error) => (
								<p className="text-destructive text-sm" key={error?.message}>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="email">
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name}>Email</Label>
							<Input
								aria-invalid={field.state.meta.errors.length > 0}
								autoComplete="email"
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
								type="email"
								value={field.state.value}
							/>
							{field.state.meta.errors.map((error) => (
								<p className="text-destructive text-sm" key={error?.message}>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="password">
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name}>Kata sandi</Label>
							<Input
								aria-invalid={field.state.meta.errors.length > 0}
								autoComplete="new-password"
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
								type="password"
								value={field.state.value}
							/>
							{field.state.meta.errors.map((error) => (
								<p className="text-destructive text-sm" key={error?.message}>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Subscribe
					selector={(state) => ({ isSubmitting: state.isSubmitting })}
				>
					{({ isSubmitting }) => (
						<Button className="w-full" disabled={isSubmitting} type="submit">
							{isSubmitting ? "Mendaftar…" : "Daftar"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="text-center">
				<Button onClick={onSwitchToSignIn} variant="link">
					Sudah punya akun? Masuk
				</Button>
			</div>
		</div>
	);
}
