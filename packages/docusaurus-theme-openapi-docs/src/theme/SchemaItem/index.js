/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import CodeBlock from "@theme/CodeBlock";
/* eslint-disable import/no-extraneous-dependencies*/
import { createDescription } from "docusaurus-theme-openapi-docs/lib/markdown/createDescription";
/* eslint-disable import/no-extraneous-dependencies*/
import { guard } from "docusaurus-theme-openapi-docs/lib/markdown/utils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

function SchemaItem({
  children: collapsibleSchemaContent,
  collapsible,
  name,
  qualifierMessage,
  required,
  schemaName,
  schema,
}) {
  let deprecated;
  let schemaDescription;
  let defaultValue;
  let nullable;
  if (schema) {
    deprecated = schema.deprecated;
    schemaDescription = schema.description;
    defaultValue = schema.default;
    nullable = schema.nullable;
  }

  const renderRequired = guard(
    Array.isArray(required) ? required.includes(name) : required,
    () => (
      <span className="badge badge--danger openapi-schema__required">
        required
      </span>
    )
  );

  const renderDeprecated = guard(deprecated, () => (
    <span className="badge badge--warning openapi-schema__deprecated">
      deprecated
    </span>
  ));

  const renderNullable = guard(nullable, () => (
    <span className="badge badge--info openapi-schema__nullable">nullable</span>
  ));

  const renderSchemaDescription = guard(schemaDescription, (description) => (
    <div>
      <ReactMarkdown
        children={createDescription(description)}
        components={{
          pre: "div",
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (inline) return <code>{children}</code>;
            return !inline && match ? (
              <CodeBlock className={className}>{children}</CodeBlock>
            ) : (
              <CodeBlock>{children}</CodeBlock>
            );
          },
        }}
        rehypePlugins={[rehypeRaw]}
      />
    </div>
  ));

  const renderQualifierMessage = guard(qualifierMessage, (message) => (
    <div>
      <ReactMarkdown
        children={createDescription(message)}
        rehypePlugins={[rehypeRaw]}
      />
    </div>
  ));

  const renderDefaultValue = guard(
    typeof defaultValue === "boolean" ? defaultValue.toString() : defaultValue,
    (value) => (
      <div className="">
        <ReactMarkdown children={`**Default value:** \`${value}\``} />
      </div>
    )
  );

  const schemaContent = (
    <div>
      <span className="openapi-schema__container">
        <strong className={deprecated && "openapi-schema__strikethrough"}>
          {name}
        </strong>
        <span className="openapi-schema__name"> {schemaName}</span>
        {(nullable || required || deprecated) && (
          <span class="openapi-schema__divider"></span>
        )}
        {renderNullable}
        {!deprecated && renderRequired}
        {renderDeprecated}
      </span>
      {renderQualifierMessage}
      {renderDefaultValue}
      {renderSchemaDescription}
    </div>
  );

  return (
    <li className="openapi-schema__list-item">
      {collapsible ? collapsibleSchemaContent : schemaContent}
    </li>
  );
}

export default SchemaItem;
