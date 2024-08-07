"use client";

import { startTransition, useId, useTransition } from "react";
import { useForm } from "react-hook-form";

import type { z } from "zod";

import { Button } from "@/browser/reliverse/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/browser/reliverse/ui/Form";
import { Input } from "@/browser/reliverse/ui/Input";
import { addToCartAction } from "@/server/reliverse/actions/cart";
import { catchError } from "@/server/reliverse/errors/helpers/auth";
import { updateCartItemSchema } from "@/server/reliverse/validations/cart";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import consola from "consola";
import tryToCatch from "try-to-catch";

import { Icons } from "~/components/Common/Icons";

type AddToCartFormProps = {
  email?: string;
  productId: number;
  session?: unknown;
  storeId: string;
  tAddToCart: "Add to cart" | string;
};

type Inputs = z.infer<typeof updateCartItemSchema>;

export default function AddToCartForm({
  productId,
  storeId,
  tAddToCart,
}: AddToCartFormProps) {
  const id = useId();

  // const [isPending, startTransition] = useTransition();
  const [isPending] = useTransition();

  // react-hook-form
  const form = useForm<Inputs>({
    defaultValues: {
      quantity: 1,
      storeId: Number(storeId),
    },
    resolver: zodResolver(updateCartItemSchema),
  });

  const onSubmit = (data: Inputs) => {
    startTransition(async () => {
      const [error] = await tryToCatch(addToCartAction, {
        productId,
        quantity: data.quantity,
        storeId: Number(storeId),
      });

      if (error) {
        consola.error(
          "Something went wrong with adding to cart. Please try again later.",
        );
        catchError(error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex items-center space-x-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-center">
          <Button
            className="size-8"
            disabled={isPending}
            id={`${id}-decrement`}
            onClick={() => {
              form.setValue(
                "quantity",
                Math.max(0, form.getValues("quantity") - 1),
              );
            }}
            type="button"
            variant="outline"
          >
            <MinusIcon aria-hidden="true" className="size-3" />
            <span className="sr-only">Remove one item</span>
          </Button>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">Quantity</FormLabel>
                <FormControl>
                  <Input
                    className="h-8 w-14 rounded-none border-x-0"
                    inputMode="numeric"
                    min={0}
                    type="number"
                    {...field}
                    onChange={(event) => {
                      const { value } = event.target;
                      const parsedValue = Number.parseInt(value, 10);

                      if (Number.isNaN(parsedValue)) {
                        return;
                      }

                      field.onChange(parsedValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="size-8 rounded-l-none"
            disabled={isPending}
            id={`${id}-increment`}
            onClick={() => {
              form.setValue("quantity", form.getValues("quantity") + 1);
            }}
            type="button"
            variant="outline"
          >
            <PlusIcon aria-hidden="true" className="size-3" />
            <span className="sr-only">Add one item</span>
          </Button>
        </div>
        <Button
          disabled={isPending}
          size="default"
          type="submit"
          variant="secondary"
        >
          {isPending ? (
            <Icons.spinner
              aria-hidden="true"
              className="mr-2 size-4 animate-spin"
            />
          ) : (
            tAddToCart
          )}
        </Button>
      </form>
    </Form>
  );
}
