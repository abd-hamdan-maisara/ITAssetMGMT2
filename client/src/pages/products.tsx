import { ProductList } from "@/components/inventory/product-list";
import { Helmet } from "react-helmet";

export default function Products() {
  return (
    <>
      <Helmet>
        <title>Products | InvenTrack</title>
        <meta name="description" content="Browse and manage your product inventory" />
      </Helmet>
      <ProductList />
    </>
  );
}
