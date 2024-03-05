
type LogFunction = ( msg: string, ...args: Array<any> ) => boolean;

export interface Logger {
    level		: number;
    levels		: {
	fatal		: boolean;
	error		: boolean;
	warn		: boolean;
	normal		: boolean;
	info		: boolean;
	debug		: boolean;
	trace		: boolean;
    };
    fatal		: LogFunction;
    error		: LogFunction;
    warn		: LogFunction;
    normal		: LogFunction;
    info		: LogFunction;
    debug		: LogFunction;
    trace		: LogFunction;
};

export type FunctionType = ((
    args	       ?: any,
    call_opts	       ?: any,
) => Promise<any>);

export type FunctionsMap = Record<string, FunctionType>;

export interface ZomeletInterface {
    functions		: FunctionsMap;
    dependencies       ?: any;
    transformers       ?: any;
};

export type CellZomeletInterface = {
    [key: string]:	ZomeletInterface;
};

export type PeerZomes<Zomelets> = {
    [K in keyof Zomelets]: Zomelets[K] extends ZomeletInterface
	? Zomelets[K]["functions"]
	: {};
}

export type PeerCells<CellZomelets> = {
    [Role in keyof CellZomelets]: CellZomelets[Role] extends CellZomeletInterface
	? PeerZomes<CellZomelets[Role]>
	: {};
}

export type DependenciesZomes<D> = D extends { zomes: infer PeerZomelets }
    ? PeerZomes<PeerZomelets>
    : {};

export interface CallContext<Functions, Dependencies> {
    functions		: {
	[K in keyof Functions]: Functions[K] extends FunctionType ? Functions[K] : never;
    };
    zomes		: DependenciesZomes<Dependencies>;
    cells		: Dependencies extends { cells: infer PeerCellZomelets }
	? PeerCells<PeerCellZomelets>
	: {};

    call (
	input	       ?: any,
	call_opts      ?: any,
    ) : Promise<any>;

    log			: Logger;
}

export type ZomeletFunctions<T extends FunctionsMap> = T;
export type ZomeletScopedFunctions<F,D> = {
    [K in keyof F]: F[K] extends FunctionType ? F[K] : never;
} & ThisType<CallContext<F,D>>;

// export type ZomeletDependency<Z = {}, C = {}> = {
//     zomes	       ?: Z;
//     cells	       ?: C;
// };

export type Zomelet<F, D = {}> = {
    functions		: ZomeletScopedFunctions<F, D>;
    dependencies       ?: D;
    transformers       ?: any;
};
